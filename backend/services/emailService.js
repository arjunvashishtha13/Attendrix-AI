const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const { smtp } = require('../config/env');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!smtp.host || !smtp.user) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });
  return transporter;
};

const sendEmail = async ({ to, subject, html, userId, type = 'reminder' }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    subject,
    message: html,
    sent: false,
  });

  const transport = getTransporter();
  if (!transport) {
    console.log(`[Attendrix AI] Email queued (SMTP not configured): ${to} — ${subject}`);
    return { queued: true, notificationId: notification._id };
  }

  await transport.sendMail({ from: smtp.from, to, subject, html });
  notification.sent = true;
  notification.sentAt = new Date();
  await notification.save();

  return { sent: true, notificationId: notification._id };
};

const sendAttendanceReminder = async (user, course, stats) => {
  const html = `
    <div style="font-family:sans-serif;max-width:520px">
      <h2 style="color:#e11d48">Attendrix AI</h2>
      <p>Hi ${user.profile?.fullName || user.username},</p>
      <p>Your attendance for <strong>${course.name}</strong> (${course.code}) is at <strong>${stats.percentage}%</strong>.</p>
      <p>Present: ${stats.present} | Absent: ${stats.absent}</p>
      <p>Please maintain at least 75% attendance to stay eligible.</p>
    </div>
  `;
  return sendEmail({
    to: user.email,
    subject: `Attendance reminder — ${course.code}`,
    html,
    userId: user._id,
    type: 'reminder',
  });
};

module.exports = { sendEmail, sendAttendanceReminder };
