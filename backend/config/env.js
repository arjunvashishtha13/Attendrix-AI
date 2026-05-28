require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendrix',
  jwtSecret: process.env.JWT_SECRET || 'attendrix-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3001',
  faceConfidenceThreshold: parseFloat(process.env.FACE_CONFIDENCE_THRESHOLD || '0.72'),
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'Attendrix AI <noreply@attendrix.ai>',
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID || 'client_id',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || 'client_secret',
    redirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/oauth/callback',
    providerBaseUrl: process.env.OAUTH_PROVIDER_URL || 'https://channeli.in',
    state: process.env.OAUTH_STATE || 'attendrix-state',
  },
};
