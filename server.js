 var app = require('express')();
 var passport = require('passport');
 var session = require('express-session');
 var bodyParser = require('body-parser');
 var env = require('dotenv').load();
 var exphbs = require('express-handlebars');
 var path = require("path");

 //For BodyParser
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));


 // For Passport
 app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
 app.use(passport.initialize());
 app.use(passport.session()); // persistent login sessions

 // Views (V)  -- For Handlebars
 app.set('views', './app/views')
 app.engine('hbs', exphbs({ extname: '.hbs' }));
 app.set('view engine', '.hbs');

 // This is the default page - set your home page here
 app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname+'/app/views/home.html'));
 });

 //Models (M)
 var models = require("./app/models");

 //Routes (C)  -- Controllers
 var authRoute = require('./app/routes/email-auth-routes.js')(app, passport);
 var serviceRoute = require('./app/routes/service-routes.js')(app);
 
 //load passport strategies
 require('./app/config/passport/passport.js')(passport, models.user);

 //Sync Database
 models.sequelize.sync().then(function() {
     console.log('Nice! Database looks fine')
 }).catch(function(err) {
     console.log(err, "Something went wrong with the Database Update!")
 });

 // Server is listening on port 5000
 app.listen(5000, function(err) {
     if (!err)
         console.log("Site is live");
     else console.log(err)
 });