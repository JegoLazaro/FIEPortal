/* eslint-disable max-len */
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const db = require('./models/db.js');
const app = express();
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
require('./passport-config.js')(passport);

// commented out for local testing
// mongoDB
// const dbURI = 'monmongodb+srv://DeveloperOne:12345@cluster0.xc7ad.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//
// mongoose.connect(dbURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then((result) => app.listen(process.env.PORT || 3000), console.log('Connection success!'))
//     .catch((err) => console.log(err));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public/pictures'));
app.use(express.urlencoded({
    extended: false,
}));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});


hbs.registerHelper('ifeq', function(a, b, options) {
    if (a == b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('ifnoteq', function(a, b, options) {
    if (a != b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
});
hbs.registerHelper('decimalFormat', function(value) {
    return parseFloat(value).toFixed(2);
});

hbs.registerHelper('reverse', function(arr) {
    arr.reverse();
});


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000},
}),
);

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use('/', require('./routes/routes'));

db.connect();

port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('port: '+ port);
});


// handle 404 requests
app.use(function(req, res) {
    res.render('404');
});

module.exports = app;
