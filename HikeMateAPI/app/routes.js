// =======================
// routes ================
// =======================
// basic route
var router = express.Router();
var Useradd = require('./routes/AddUser');
var Login = require('./routes/Login');
var UpdateLocation = require('./routes/UpdateLocation');
var Test = require('./routes/Test');

	router.route('/AddUser').post(Useradd.AddUser); 
	router.route('/Login').post(Login.Login); 
	
	
	
	router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.route('/UpdateLocation').post(UpdateLocation.UpdateLocation);
router.route('/test').get(Test.Test); 

	
module.exports = router;