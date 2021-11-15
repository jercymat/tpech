var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var config = require('./config')

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var findDoctorRouter = require('./routes/find_doctor');
var clinicProgressRouter = require('./routes/clinic_progress');
var queryRegRouter = require('./routes/query_reg');
var regRouter = require('./routes/reg');
var symptomRouter = require('./routes/symptom');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

var rootRouter = express.Router();

rootRouter.use('/', indexRouter);
rootRouter.use('/api', apiRouter);
rootRouter.use('/find_doctor', findDoctorRouter);
rootRouter.use('/clinic_progress', clinicProgressRouter);
rootRouter.use('/query_reg', queryRegRouter);
rootRouter.use('/reg', regRouter);
rootRouter.use('/symptom', symptomRouter);

app.use(config.baseUrl, rootRouter);

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
