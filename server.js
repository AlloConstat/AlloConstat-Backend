const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
require('./config/db'); // Assurez-vous de configurer mongoose
require('./config/passport'); // Assurez-vous de configurer passport

const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
