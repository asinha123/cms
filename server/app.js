var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var jws = require('express-jwt-session');
var secret = 'this is the secret';


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var isAuthenticated = jws.isAuthenticated(secret).unless({path: ['/api/auth/user/login']});
// We are going to protect /api/auth routes with JWT
app.use('/api/auth', isAuthenticated);


var registerRouter = require('./routes/register');

var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');
var contactRouter = require('./routes/contact');

app.use('/api/user', registerRouter);

app.use('/api/auth/user', userRouter);
app.use('/api/auth/group', groupRouter);
app.use('/api/auth/contact', contactRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
