module.exports = {
	
	getSecret: function(Uid, callback){
		var dbPassword;
		pool.connect((err, client, done) => {
				// Handle connection errors
				if(err) {
					done();
					console.log(err);
					return '';
				}
				
				
				var result = '';
				var query = client.query({text:'SELECT "Password" FROM "Users" WHERE "uid" = $1',values: [Uid]}).on('error', function(err) {
		      	console.error('error running query', err);
		      	done();
					return callback('');
				}).on('row', function(row) {
					dbPassword = row.Password;
					done();
			   				
			   }).on('end', function(result) { //this point no user found
		      	if(result.rowCount == 1){ //must be the user as username is unique
		      		//check if password matches
							return callback(dbPassword + '');
		      		}
		      		else{
		      			return callback('');
		      		}
		    	});
		   });
	}
}
