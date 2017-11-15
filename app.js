var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Start connection
var mongooseClient = require("./bin/mongoose_client");
mongooseClient.connectDB(function () {
    console.log("db connection successful");
}, function (err) {
    console.log("Error" + err);
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'src/scss'),
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: true,
  prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, 'public')));


var playlistHandler = require("./routes/playlistHandler");
app.use('/api/playlists',playlistHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Google Sign IN
var auth = require('./middlewares/google_auth');


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
