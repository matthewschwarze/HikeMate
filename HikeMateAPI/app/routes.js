// =======================
// routes ================
// =======================
// basic route
var router = express.Router();
var Useradd = require('./routes/AddUser');
var Test = require('./routes/Test');

	router.route('/test').get(Test.Test); 
	router.route('/AddUser').post(Useradd.AddUser); 

module.exports = router;