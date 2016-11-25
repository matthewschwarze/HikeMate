const sha1 = require('sha1');

module.exports = {
	Login: function (req, res, next){
		var username = req.body.UserName + '';
		var password = req.body.Password + '';

		pool.connect((err, client, done) => {
			// Handle connection errors
			if(err) {
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}
			var dbUsername;
			var dbPassword;
			var dbSalt;
			var result = '';
			var query = client.query({text:'SELECT "UserName", "Password", "Salt" FROM "Users" WHERE "UserName" = $1',values: [username]}, function(err, result){
			}).on('row', function(row) {
				dbUsername = row.username;
				dbPassword = row.Password;
				dbSalt = row.Salt;
				done();
		   				
		   }).on('error', function() {
	      	console.error('error running query', err);
	      	done();
				return res.status(500).json({success: false, status: 500, data: err});
			}).on('end', function(result) { //this point no user found
		      	console.log(result.rowCount + ' rows were received');
		      	
	      	if(result.rowCount == 1){ //must be the user as username is unique
	      		//check if password matches
	      		var user = {"UserName" : dbUsername, "Password" : dbPassword, "Salt" : "dbSalt"};
	      		var givenPassword = sha1(password + dbSalt)
	      		if(givenPassword == dbPassword){
						var token = jwt.sign(user, app.get('superSecret'), {
							expiresIn : "1440m" // expires in 24 hours
						});
	      			return res.json({
			          success: true,
			          message: 'Enjoy your token!',
			          token: token
			        });
	      		}
	      		else{
	      			return res.status(500).json({success: false, status: 500, data: {err:"UserName Password combination does not match"}});
	      		}
	      	}
	      	return res.status(500).json({success: false, status: 500, data: {err: "no user found"}});
	    	});
	   }); 
	}
}