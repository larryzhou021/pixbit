var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var LedMatrix = require("easybotics-rpi-rgb-led-matrix");
var gm = require('gm');
var getPixels = require("get-pixels");
var mime = require('mime-types');
var matrix = new LedMatrix(64, 64);

getPixels("http://transfer.static.keyfactory.group/testimag.png", function (err, pixels) {
  if (err) {
    console.log("Bad image path")
    return
  }
  for (let x = 0; x < 64; x++) {
    for (let y = 0; y < 64; y++) {
      matrix.setPixel(x, y, pixels.get(x, y, 0), pixels.get(x, y, 1), pixels.get(x, y, 2));
    }
  }
  matrix.update();
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
