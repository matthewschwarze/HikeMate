//pg.connect(config.database); // connect to database
var config = require('./config');
pool = new pg.Pool(config.database);