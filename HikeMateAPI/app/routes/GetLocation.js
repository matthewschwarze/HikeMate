module.exports = {
	GetLocation: function (req, res, next){
		var results = [];
		 //check if data is valid
		if(req.body.Uid === "" || req.body.RequestId === "" || req.body.RequestId === undefined || req.body.Uid === undefined){ //empty
			return res.status(500).json({success: false, status: 500, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		var RequestId = req.body.RequestId;
		
		if(id != RequestId){ //requesting a friends id
			canAccess(res, req, id, RequestId);
		}else{
			getLocation(req, res, RequestId);
		}
	}
}


function getLocation(req, res, RequestId){
	pool.connect((err, client, done) => {
		// Handle connection errors
			if(err) {
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}
			var query = client.query({text:'SELECT "Latitude", "Longitude", "UTCTime" FROM "Location" WHERE "Uid" = $1',values: [RequestId]}, function(err, result){
			}).on('row', function(row) {
					dbresult = row;
					console.log(dbresult);
					done();

			}).on('error', function() {
					console.error('error running query', err);
					done();
					return res.json({success: false, data: err});
			}).on('end', function(result) { //this point no user found
					console.log(result.rowCount + ' rows were received');

					if(result.rowCount == 1){ //must be the user as username is unique
					//check if password matches
						return res.json({
						success: true,
						data: {location: dbresult}
						});
					}
					else{
						return res.json({success: false, data: {err:"could not get location"}});
					}
				});
		}); 
}

function canAccess(res, req, id, RequestId){
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	     return res.status(500).json({success: false, data: err});
	    } 
			var query = client.query('SELECT * FROM "Friendship" where ("InitUser" = $1 OR "InitUser" = $4) AND ("RecUser" = $4 OR "RecUser" = $1) AND "Active" = $2 AND "Blocked" = $3',
	   	[id, true, false, RequestId], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.json({success: false, data: err});
					}
				})
				.on('end', function(result) { //this point no user found
					done();
					console.log(result.rowCount);
		   		if(result.rowCount == 0){
		   			return res.json({success: false, data: {message: "Permission denided"}});	
		   		}else{
		   			getLocation(req, res, RequestId)
		   		}	
	    		});   
	   });	
}