const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { clientUrl } = require('./config/env');

const app = express();

const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  const allowed =
    [clientUrl, 'http://localhost:3000', 'http://localhost:3001'].includes(origin) ||
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
  callback(null, allowed);
};

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? [clientUrl] : corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

module.exports = app;
