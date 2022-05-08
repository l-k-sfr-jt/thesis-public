const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const dbConfig = require('./config/db.config')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/order');
const offerRouter = require('./routes/offer');
const projectRouter = require('./routes/project');
const technicianRouter = require('./routes/technician');
const invoicesRouter = require('./routes/invoices');

const app = express();

app.use(cors({ credentials: true,}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.use('/offers', offerRouter);
app.use('/projects', projectRouter);
app.use('/technicians',technicianRouter);
app.use('/invoices', invoicesRouter)

mongoose
    .connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@thesis.iwvjd.mongodb.net/${dbConfig.DB}`)
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

module.exports = app;
