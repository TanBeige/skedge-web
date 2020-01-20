var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const storage = require('./routes/Storage');
const profile = require('./routes/Profile');
const moment = require('./routes/Moment');
const auth0calls = require('./routes/Auth0calls');
const email = require('./routes/Email');

var app = express();
var env = process.env.NODE_ENV || 'development';
console.log(env)


//Redirect to https://
var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (env === 'production') {
  app.use(forceSsl);
}

app.use(logger('tiny'));
app.use(cors({
  credentials: true,
  origin: true
}))
app.disable('x-powered-by')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/storage', storage);
app.use('/profile', profile);
app.use('/moment', moment);
app.use('/auth0', auth0calls);
app.use('/email', email);

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
