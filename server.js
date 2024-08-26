const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
require('./config/db'); // Assurez-vous de configurer mongoose
require('./config/passport'); // Assurez-vous de configurer passport

const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const constatRoutes = require('./routes/constatRoutes.js');
const vehiculeRoutes = require('./routes/vehiculeRoutes.js');
const pdfRoutes = require('./routes/pdfRoutes');
const messageRoutes = require('./routes/messageRoutes.js');
const cors = require('cors')
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/pdfs', express.static(path.join(__dirname, 'output/voitures')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/constats', constatRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/messages', messageRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
