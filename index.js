const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authroutes = require('./Routes/auth');
const postroute = require('./Routes/posts');

dotenv.config();
//connect db
mongoose
    .connect('mongodb://172.17.0.1:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected'))
    .catch(err => console.error('Could not connect', err));
//Middlewares
app.use(express.json());

app.use('/api/user', authroutes);
app.use('/api/posts', postroute);

app.listen(3000, () => console.log('server up and running'));
