module.exports = {
	GetLocation: function (req, res, next){

	pool.connect((err, client, done) => {
	// Handle connection errors
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		var query = client.query({text:'SELECT "Latitude", "Longitude", "UTCTime" FROM "Location" WHERE "Uid" = $1',values: [req.body.Uid]}, function(err, result){
		}).on('row', function(row) {
				dbresult = row;
				console.log(dbresult);
				done();

		}).on('error', function() {
				console.error('error running query', err);
				done();
				return res.status(500).json({success: false, status: 500, data: err});
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
					return res.status(500).json({success: false, status: 500, data: {err:"could not get location"}});
				}
			});
		}); 
	}
}