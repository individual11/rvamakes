/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    db;

// set data connection
if (process.env.NODE_ENV == 'production') {
    db = require('./db');
}else {
    db = require('./db-local');
}

var app = express(),
	creative = require('./routes/creative');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: "this!secret!sucks!and!will^be^changed$for$production@bitches",
    cookie: {httpOnly: true}
}));
app.use(express.csrf());

app.use(function (req, res, next) {
    res.locals.csrftoken = req.session._csrf;
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


// Creatives
app.get('/api/creatives', creative.index);
app.get('/api/creatives/:id', creative.show);
app.post('/api/creatives', creative.create);
app.delete('/api/creatives/:id', creative.delete);
// REMOVED FOR PRODUCTION
// app.delete('/api/creatives/reset', creative.reset);

// Root
app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
