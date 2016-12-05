module.exports = {
	AddFriend: function (req, res, next){
	  // Grab data from http request
	 var results = [];
	 
	 //check if data is valid
	if(req.body.Uid === "" || req.body.friendId === "" ){ //empty
		return res.status(500).json({success: false, status: 500, data: {err: "One or more fields cannot be blank"}});
	}
	var id = req.body.Uid;
	var friendId = req.body.friendId;
	if(id == friendId){
		return res.json({success: false, data: {message: "You can't be friends with yourself"}});
	}
	
	//check if user to add exists
		//check if invite already exists, if init id is in the recive column set active to true
		// else invite already sent, return pending invite
		recordExists(res, id, friendId);	
	}
}

function recordExists(res, id, friendId){
	//return res.json({success: true, data: {message: "row not found"}});
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	     return res.status(500).json({success: false, data: err});
	    } 
			var query = client.query('SELECT * FROM "Friendship" where ("InitUser" = $1 OR "InitUser" = $2) AND ("RecUser" = $1 OR "RecUser" = $2)',
	   	[id, friendId], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.status(500).json({success: false, status: 500, data: err});
					}
				})
				.on('row', function(row){
					//check if i sent it or they sent it
					if(row.Active){
						return res.json({success: false, data: {message: "Already friends"}});
					}
					else if(row.InitUser == id){ //i sent it
						return res.json({success: false, data: {message: "Request already sent"}});
					}else if(row.RecUser == id){
						//accept the request
						acceptFriend(res, row.Id);
					}
					else{
						return res.json({success: false, data: {message: "Request already sent"}});
					}
					
				})
				.on('end', function(result) { //this point no user found
		   		if(result.rowCount == 0){
		   			console.log("relationship does not exists");
						//call addfriend
						createRelationship(res, id, friendId);
		   		}
		   		done();
	    		});   
	   });	
}

function createRelationship(res, id, friendId){
	//return res.json({success: true, data: {message: "row not found"}});
	pool.connect((err, client, done) => {
	 // Handle connection errors
	 if(err) {
	 	done();
	   console.log(err);
	   return res.status(500).json({success: false, data: err});
	 } 
		var query = client.query('INSERT INTO "Friendship" ("InitUser", "RecUser", "Active", "Blocked") values($1, $2, $3, $4)',
		[id, friendId, false, false], function(err, result){
		
		    if(err) {
		    	done();
		      //console.error('error running query', err);
		      return res.status(500).json({success: false, status: 500, data: err});
		    }
	    	// SQL Query > Select Data
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
		     done();
		     results = "Relationship created succesfully";
		     return res.json({success: true, data: {message: results}});
		    });
		});
	});	
}

function acceptFriend(res, id){
	pool.connect((err, client, done) => {
	 // Handle connection errors
	 if(err) {
	 	done();
	   console.log(err);
	   return res.status(500).json({success: false, data: err});
	 } 
		var query = client.query('UPDATE "Friendship" SET "Active" = $1 where "Id" = $2 ',
		[true, id], function(err, result){
		
		    if(err) {
		    	done();
		      //console.error('error running query', err);
		      return res.status(500).json({success: false, status: 500, data: err});
		    }
	    	// SQL Query > Select Data
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
		     done();
		     return res.json({success: true, data: {message: "Accepted"}});
		    });
		});
	});	
}