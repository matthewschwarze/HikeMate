var sha1 = require('sha1');
const crypto = require('crypto');

module.exports = {
	AddUser: function (req, res, next){
	  // Grab data from http request
	 console.log(req.body);
	 const results = [];
	  // Get a Postgres client from the connection pool
	  pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    }
	    // SQL Query > Insert Data
		
	   var salt = crypto.randomBytes(256, (err, buf) => {
		 	 if (err) throw err;
		  		console.log(`${buf.length} bytes of random data: ${buf.toString('base64')}`);
		  		return buf.toString('base64');
		});
		
		var NewSalt = sha1(salt); //encode salt
		var encodedpword =sha1(req.body.Password + NewSalt); //already sha1 pword with sha1 salt


	   var query = client.query('INSERT INTO "Users" ("UserName", "Email", "Password", "Salt") values($1, $2, $3, $4)',
	   	[req.body.UserName, req.body.Email, encodedpword, NewSalt], function(err, result){
	   	
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