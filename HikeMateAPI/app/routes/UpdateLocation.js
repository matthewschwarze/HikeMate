
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
	    
	    var message = {success: true, data: {message: "row created"}};
	    
	    var query = client.query('SELECT "Uid" FROM "Location" WHERE "Uid" = $1 ', [req.body.Uid], function(err, result){
	    	
					if(err){
						console.error('error running query', err);
						return res.status(500).json({success: false, status: 500, data: err});
					}
				})
				.on('end', function(result) { //this point no user found
					//done();
		   		console.log(result.rowCount + ' rows were received');
		   		
		   		if(result.rowCount == 1){
		   			update(res, req);
		   		}
		   		else{
	      			insert(res, req);
	      		}
	    		});   	
	   });
	}
	
}

function insert(res, req){
	//return res.json({success: true, data: {message: "row not found"}});
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    } 
			var query = client.query('INSERT INTO "Location" ("Uid", "UTCTime", "Longitude", "Latitude") values($1, $2, $3, $4)',
	   	[req.body.Uid, req.body.UTC, req.body.Long, req.body.Lat], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.status(500).json({success: false, status: 500, data: err});
					}
				})
				.on('end', function(result) { //this point no user found
		   		console.log(result.rowCount + ' rows were received');
		   		
		   		if(result.rowCount == 1){
		   			return res.json({success: true, data: {message: "row created"}});
		   		}
		   		else{
	      			return res.json({success: true, data: {message: "row not created"}});
	      		}
	    		});   
	   });	
}

function update(res, req){
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    } 
			var query = client.query('UPDATE "Location" SET "UTCTime" = $1, "Longitude" = $2, "Latitude" = $3 WHERE "Uid" = $4',
	   	[req.body.UTC, req.body.Long, req.body.Lat, req.body.Uid], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.status(500).json({success: false, status: 500, data: err});
					}
				})
				.on('end', function(result) { //this point no user found
		   		console.log(result.rowCount + ' rows were received');
		   		
		   		if(result.rowCount == 1){
		   			return res.json({success: true, data: {message: "row updated"}});
		   		}
		   		else{
	      			return res.json({success: true, data: {message: "row not updated"}});
	      		}
	    		});   
	   });	
}
/*

UPDATE table SET field='C', field2='Z' WHERE id=3;
INSERT INTO table (id, field, field2)
       SELECT 3, 'C', 'Z'
       WHERE NOT EXISTS (SELECT 1 FROM table WHERE id=3);
*/