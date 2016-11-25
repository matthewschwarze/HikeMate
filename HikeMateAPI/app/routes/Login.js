
module.exports = {
	Login: function (req, res, next){
		var username = req.body.UserName + '';
		var password = sha1(req.body.Password + '');

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
		   	
			if(err) {
				done();
				console.error('error running query', err);
				return res.status(500).json({success: false, status: 500, data: err});
			}
					
		}).on('row', function(row) {
			console.log('user "%s" is "%s", "%s"', row.UserName, row.Password, row.Salt);
			done();
			result =  res.json({
       		success: true,
       		message: 'Enjoy your token!',
       		token: "wow"
     		});
	   				
	   }).on('error', function() {
      	console.error('error running query', err);
      	done();
			return res.status(500).json({success: false, status: 500, data: err});
		}).on('end', function(result) { //this point no user found
      	console.log(result.rowCount + ' rows were received');
      	if(result.rowCount == 1){
      		return result;
      	}
      	return res.status(500).json({success: false, status: 500, data: "no user found"});
    	});

	    /*if (!user) {
	      res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {
	      // check if password matches
		      if (user.password != req.body.password) {
		        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		      } else {

		        // if user is found and password is right
		        // create a token
		        var token = jwt.sign(user, app.get('superSecret'), {
		          expiresInMinutes: 1440 // expires in 24 hours
		        });

		        // return the information including token as JSON
		        res.json({
		          success: true,
		          message: 'Enjoy your token!',
		          token: token
		        });
		      } */
	   }); 
	}
}