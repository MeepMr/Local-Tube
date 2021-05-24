const express = require('express');
const path = require('path');

//Import routers
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const watchRouter = require('./routes/watch');
const downloadRouter = require('./routes/download');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Register the Routers
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/watch', watchRouter);
app.use('/download', downloadRouter);

module.exports = app;
