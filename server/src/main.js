var express = require('express');
var debug = require('debug')('server');
var app = express();
var dbConnection = require('./lib/dbConnection');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var posts = require('./routes/posts');
var system = require('./routes/system');
var methodOverride = require('method-override');

const info = {
  version: __VERSION__,
  hash: __HASH__,
  build_number: __BUILD_NUMBER__,
  build_tag: __BUILD_TAG__
}

debug("Info", info);
debug('Connect to database');
dbConnection.pingPostgres();

debug('Migrate database');
var Umzug = require('umzug');
var umzug = new Umzug(require('./config/umzug'));

umzug.up().then(function (migrations) {
   migrations.forEach(function(e) {
    debug(`Run migration ${e.file}`);
   });
});

debug('Configure Express');
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());

app.use('/', express.static('../public'));
app.use('/api', posts);
app.use('/api', system);

debug('Configure error handling');
// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500).json(err);
});

module.exports = app;
