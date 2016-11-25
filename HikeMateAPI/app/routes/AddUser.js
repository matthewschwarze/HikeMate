const sha1 = require('sha1');
const crypto = require('crypto');
const validator = require('validator');

module.exports = {
	AddUser: function (req, res, next){
	  // Grab data from http request
	 var results = [];
	 
	 //check if data is valid
	if(req.body.UserName == "" || req.body.Email == "" || req.body.Password == ""){ //empty
		return res.status(500).json({success: false, status: 500, data: {err: "One or more fields cannot be blank"}});
	}
	var username = req.body.UserName + '';
	var email = req.body.Email + '';
	var password = req.body.Password + '';
	
	if(/^[a-zA-Z0-9-_]*$/.test(username) == false) {
	    return res.status(500).json({success: false, status: 500, data: {err: "Username can only contain numbers, letters, underscores and hyphens"}});
	}
	var regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9%^*!@#$&()\\-_`.+,/\"]{6,}$/;
	if(regularExpression.test(password) == false) {
	    return res.status(500).json({success: false, status: 500, data: {err: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 6 or more characters"}});
	}
	
	
	validator.normalizeEmail(email, [true]) 
	if(!validator.isEmail(email)){
		return res.status(500).json({success: false, status: 500, data: {err: "Invalid email format"}});
	}
	 
	  // Get a Postgres client from the connection pool
	  pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    }
	    // SQL Query > Insert Data
		
	   var salt = crypto.randomBytes(256);
	   /*crypto.randomBytes(256, (err, buf) => {
		 	 if (err) throw err;
		  		console.log(`${buf.length} bytes of random data: ${buf.toString('base64')}`);
		  		return buf.toString('base64');
		}); */
		var NewSalt = sha1(salt); //encode salt
		var encodedpword =sha1(password + NewSalt); //un hashed pword with sha1 salt


	   var query = client.query('INSERT INTO "Users" ("UserName", "Email", "Password", "Salt") values($1, $2, $3, $4)',
	   	[username, email, encodedpword, NewSalt], function(err, result){
	   	
			    if(err) {
			    	done();
			      //console.error('error running query', err);
			      return res.status(500).json({success: false, status: 500, data: err});
			    }
		    	// SQL Query > Select Data
			    // After all data is returned, close connection and return results
			    query.on('end', () => {
			     done();
			     results = "User created succesfully";
			     return res.json({success: true, data: results});
			    });
	   	});
	  });
	}
}