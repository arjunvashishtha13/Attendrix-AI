const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { jwtSecret, jwtExpiresIn, oauth, clientUrl } = require('../config/env');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken(user);
  res
    .status(statusCode)
    .cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
};

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, role, profile } = req.body;
  if (!username || !email || !password) {
    throw new AppError('Username, email, and password are required', 400);
  }

  const allowedRole = ['student', 'teacher'].includes(role) ? role : 'student';
  if (role === 'admin' && req.user?.role !== 'admin') {
    throw new AppError('Only admins can create admin accounts', 403);
  }

  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) throw new AppError('User already exists', 409);

  const user = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    role: role === 'admin' && req.user?.role === 'admin' ? 'admin' : allowedRole,
    profile: profile || {},
  });

  sendAuthResponse(res, user, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select('+password');
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new AppError('Invalid credentials', 401);
  }
  sendAuthResponse(res, user);
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out' });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

exports.enrollFace = asyncHandler(async (req, res) => {
  const { embeddings } = req.body;
  if (!embeddings || !Array.isArray(embeddings) || embeddings.length === 0) {
    throw new AppError('Face embeddings array is required', 400);
  }

  const user = await User.findById(req.user._id);
  user.faceEmbeddings = embeddings;
  user.hasEnrolledFace = true;
  await user.save();

  res.json({ success: true, message: 'Face enrolled successfully' });
});

exports.oauthRedirect = (req, res) => {
  const url = `${oauth.providerBaseUrl}/oauth/authorise/?client_id=${oauth.clientId}&redirect_uri=${encodeURIComponent(oauth.redirectUri)}&state=${oauth.state}`;
  res.redirect(url);
};

exports.oauthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw new AppError('Authorization code missing', 400);

  const tokenResponse = await axios.post(
    `${oauth.providerBaseUrl}/open_auth/token/`,
    new URLSearchParams({
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: oauth.redirectUri,
      code,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const userDataResponse = await axios.get(`${oauth.providerBaseUrl}/open_auth/get_user_data/`, {
    headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
  });

  const data = userDataResponse.data;
  const email = data.contactInformation?.emailAddress || `${data.username}@oauth.local`;
  let user = await User.findOne({ $or: [{ email }, { username: data.username }] });

  if (!user) {
    user = await User.create({
      username: data.username,
      email,
      password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10),
      role: 'student',
      profile: {
        fullName: data.person?.fullName || data.username,
        avatar: data.person?.displayPicture || '',
        enrollmentNumber: data.student?.enrollmentNumber || '',
        branch: data.student?.['branch name'] || '',
        year: data.student?.currentYear || 1,
        semester: data.student?.currentSemester || 1,
      },
    });
  }

  const token = signToken(user);
  res.redirect(`${clientUrl}/auth/callback?token=${token}`);
});
