const sha1 = require('sha1');
const crypto = require('crypto');
const validator = require('validator');
module.exports = {
	UpdatePassword: function (req, res, next){
	// Grab data from http request
		var results = [];

		//check if data is valid
		if(req.body.Uid === "" || req.body.Password === "" || req.body.NewPassword === ""){ //empty
			return res.status(500).json({success: false, status: 500, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		var password = req.body.Password;
		var newPassword = req.body.NewPassword
		var regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9%^*!@#$&()\\-_`.+,/\"]{6,}$/;
		if(regularExpression.test(newPassword) == false) {
			return res.status(500).json({success: false, status: 500, data: {err: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 6 or more characters"}});
		}
		updatePassword(res, id, newPassword);	
	}
}

function auth(res, id, pword){

}

function updatePassword(res, id, password){
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
	    } 
		var salt = crypto.randomBytes(256); 
		var NewSalt = sha1(salt); //encode salt
		var encodedpword =sha1(password + NewSalt); //un hashed pword with sha1 salt
			
		var query = client.query('Update "Users" Set "Password" = $2, "Salt" = $3 where "uid" = $1',
		[id, encodedpword, NewSalt], function(err, result){
			console.log('here');
			if(err){
				console.error('error running query', err);
				return res.status(500).json({success: false, status: 500, data: err});
			}
		})
		.on('end', function(result) { //this point no user found
			if(result.rowCount == 0){
				return res.json({success: false, data: {message: "Password Not Changed"}});
			}else{
				return res.json({success: true, data: {message: "Password Changed"}});
			}
		});   
		
	   });	
}