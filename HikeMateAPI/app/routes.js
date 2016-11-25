// =======================
// routes ================
// =======================
// basic route
var router = express.Router();
var Useradd = require('./routes/AddUser');
var Login = require('./routes/Login');
var Test = require('./routes/Test');

	router.route('/test').get(Test.Test); 
	router.route('/AddUser').post(Useradd.AddUser); 
	router.route('/Login').post(Login.Login); 
module.exports = router;