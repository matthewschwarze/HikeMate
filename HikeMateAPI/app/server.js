

// =======================
// get the packages we need ============
// =======================
express     = require('express');
app         = express();
bodyParser  = require('body-parser');
morgan      = require('morgan');
pg = require('pg');
jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config'); // get our config file
var db = require('./DatabaseConnection');
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; 

app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var routes = require('./routes');
app.use('/api/v1', routes);
// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
