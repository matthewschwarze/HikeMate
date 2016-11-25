
module.exports = {
	UpdateLocation: function (req, res, next){
		if(req.body.Uid == "" || req.body.UTC == "" || req.body.Long == "" || req.body.Lat == ""){ //empty
			return res.status(500).json({success: false, status: 500, data: {err: "One or more fields are empty"}});
		}	
		pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    }
	    
	    var message = ""; //= res.json({success: true, data: {message: "nothing"}});
	    
	    var query = client.query('UPDATE "Location" SET "UTCTime" = '+req.body.UTC+' WHERE "Uid" = '+req.body.Uid+'; INSERT INTO "Location" ("Uid", "UTCTime") SELECT '+ req.body.Uid +', '+req.body.UTC+', WHERE NOT EXISTS (SELECT 1 FROM "Location" WHERE "Uid"='+req.body.Uid+');', function(err, result){
					//'Insert INTO "Location" ("Uid", "UTCTime") values ($1, $2) ON CONFLICT (Uid) DO UPDATE SET "UTCTime" = $2 ', [req.body.Uid, req.body.UTC]
					message = {success: true, data: {message: result}};
					done();
				})
				.on('error', function() {
	      		console.error('error running query', err);
					return res.status(500).json({success: false, status: 500, data: err});
				})
				.on('end', function(result) { //this point no user found
		   		console.log(result.rowCount + ' rows were received');
	      		return res.json(message);
	    		});   	
	   });
	}
}

/*

UPDATE table SET field='C', field2='Z' WHERE id=3;
INSERT INTO table (id, field, field2)
       SELECT 3, 'C', 'Z'
       WHERE NOT EXISTS (SELECT 1 FROM table WHERE id=3);
*/