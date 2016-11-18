var express = require('express');
var dbConnection = require('./lib/dbConnection');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var posts = require('./routes/posts');
var system = require('./routes/system');
var methodOverride = require('method-override');
var app = express();

// connect to postgres
dbConnection.pingPostgres();

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());

app.use('/', express.static('/../public'));
app.use('/api', posts);
app.use('/api', system);

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
