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
			var dbUid;
			var result = '';
			var query = client.query({text:'SELECT "UserName", "Email", "Password", "Salt", "uid" FROM "Users" WHERE "UserName" = $1 OR "Email" = $1',values: [username]}, function(err, result){
			}).on('row', function(row) {
				dbUsername = row.UserName;
				dbPassword = row.Password;
				dbSalt = row.Salt;
				dbUid = row.uid;
				done();
		   				
		   }).on('error', function() {
	      	console.error('error running query', err);
	      	done();
				return res.json({success: false, data: err});
			}).on('end', function(result) { //this point no user found
		      	console.log(result.rowCount + ' rows were received');
		      	
	      	if(result.rowCount == 1){ //must be the user as username is unique
	      		//check if password matches
	      		var user = {"UserName" : dbUsername, "Password" : dbPassword, "Salt" : dbSalt};
	      		var givenPassword = sha1(password + dbSalt)
	      		if(givenPassword == dbPassword){
	      		console.log("ok " + dbPassword );
						var token = jwt.sign(user, (dbPassword + ''), {
							expiresIn : "1440m" // expires in 24 hours
						});
	      			return res.json({
			          success: true,
			          data: {token: token, id: dbUid}
			        });
	      		}
	      		else{
	      			return res.json({success: false, data: {err:"UserName Password combination does not match"}});
	      		}
	      	}
	      	return res.json({success: false, data: {err: "no user found"}});
	    	});
	   }); 
	}
}