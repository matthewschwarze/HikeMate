module.exports = {
	
	getSecret: function(Uid){
		var dbPassword;
		pool.connect((err, client, done) => {
				// Handle connection errors
				if(err) {
					done();
					console.log(err);
					return '';
				}
				
				
				var result = '';
				var query = client.query({text:'SELECT "Password" FROM "Users" WHERE "uid" = $1',values: [Uid]}, function(err, result){
				}).on('row', function(row) {
					dbPassword = row.Password;
					done();
			   				
			   }).on('error', function() {
		      	console.error('error running query', err);
		      	done();
					return '';
				}).on('end', function(result) { //this point no user found
			      	console.log(result.rowCount + ' rows were received');
			      	
		      	if(result.rowCount == 1){ //must be the user as username is unique
		      		//check if password matches
		      		console.log("hi");
							return dbPassword + '';
		      		}
		      		else{
		      			return '';
		      		}
		    	});
		   });
	}
}