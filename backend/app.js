const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { clientUrl } = require('./config/env');

const app = express();

app.use(
  cors({
    origin: [clientUrl, 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

module.exports = app;
