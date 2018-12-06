module.exports = {
	AddFriend: function (req, res, next){
	  // Grab data from http request
	 var results = [];
	 
	 //check if data is valid
	if(req.body.Uid === "" || req.body.friendId === "" ){ //empty
		return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
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
	},
	GetFriends: function (req, res, next){
		var results = [];
		 //check if data is valid
		if(req.body.Uid === ""){ //empty
			return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		getAllFriends(res, id);
	},
	AcceptFriend: function (req, res, next){
		var results = [];
		 //check if data is valid
		if(req.body.Uid === "" || req.body.friendId === ""){ //empty
			return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		var friendId = req.body.friendId;
		findRequest(res, id, friendId, 'AcceptFriend');
	}, 
	GetFriendRequests: function (req, res, next){
		var results = [];
		 //check if data is valid
		if(req.body.Uid === ""){ //empty
			return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		getPendingRequests(res, id);
	},
	DeleteFriend: function (req, res, next){
		var results = [];
		 
		 //check if data is valid
		if(req.body.Uid === "" || req.body.friendId === "" ){ //empty
			return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		var friendId = req.body.friendId;
		if(id == friendId){
			return res.json({success: false, data: {message: "You can't delete yourself"}});
		}
		findRequest(res, id, friendId, 'DeleteFriend');
		
	},
	BlockFriend: function (req, res, next){
		var results = [];
			 
		 //check if data is valid
		if(req.body.Uid === "" || req.body.friendId === "" ){ //empty
			return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		var friendId = req.body.friendId;
		if(id == friendId){
			return res.json({success: false, data: {message: "You can't block yourself"}});
		}
		findRequest(res, id, friendId, 'BlockFriend');
	},
	UnBlockFriend: function (req, res, next){
		var results = [];
		 //check if data is valid
		if(req.body.Uid === "" || req.body.friendId === "" ){ //empty
			return res.json({success: false, data: {err: "One or more fields cannot be blank"}});
		}
		var id = req.body.Uid;
		var friendId = req.body.friendId;
		if(id == friendId){
			return res.json({success: false, data: {message: "You can't block yourself"}});
		}
		findRequest(res, id, friendId, 'UnBlockFriend');
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
						return res.json({success: false, data: err});
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
		      return res.json({success: false, data: err});
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
		      return res.json({success: false, data: err});
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

function getAllFriends(res, id){
//return res.json({success: true, data: {message: "row not found"}});
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	     return res.status(500).json({success: false, data: err});
	    } 
	    	var friends = [];
			var query = client.query('SELECT u1."UserName" As inituser, f."InitUser", u2."UserName" As recuser, f."RecUser", f."Blocked" FROM "Friendship" f left JOIN "Users" u1 ON u1.uid = f."InitUser"  left JOIN "Users" u2 ON u2.uid = f."RecUser"  where (f."InitUser" = $1 OR f."RecUser" = $1) AND f."Active" = $2 AND (f."Blocked" = $3 OR f."InitBlockUser" = $1)',
	   	[id, true, false], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.json({success: false, data: err});
					}
				})
				.on('row', function(row){
					if(row.InitUser == id){ //you sent it
						userName = row.recuser;
						recId = row.RecUser;
					}else{//friend sent it
						userName = row.inituser;
						recId = row.InitUser;
					}					
					var friend = {username: userName, Id: recId, Blocked:row.Blocked};
					friends.push(friend);
				})
				.on('end', function(result) { //this point no user found
		   		done();
		   		return res.json({success: true, data: {friends}});		
	    		});   
	   });	
}

function findRequest(res, id, friendId, route){
//return res.json({success: true, data: {message: "row not found"}});
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	     return res.status(500).json({success: false, data: err});
	    } 
	    
			if(route == 'AcceptFriend'){
	   		var query = client.query('SELECT * FROM "Friendship" where "InitUser" = $1 AND "RecUser" = $2 AND "Active" = $3',
	   	[friendId, id, false], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.json({success: false, data: err});
					}
				})
				.on('row', function(row){
					acceptFriend(res, row.Id);
				})
				.on('end', function(result) { //this point no user found
					done();
		   		if(result.rowCount == 0){
		   			console.log("relationship does not exists");
						return res.json({success: false, data: {message: "No request"}});
		   		}
	    		});  
			}else{
				var query = client.query('SELECT * FROM "Friendship" where ("InitUser" = $1 AND "RecUser" = $2) OR ("InitUser" = $2 AND "RecUser" = $1)',
	   		[id, friendId], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.status(500).json({success: false, status: 500, data: err});
					}
				})
				.on('row', function(row){ //these routes take the row id and make changes directly on the row
					switch (route){
						case 'BlockFriend': alterFriendShip(res, row.Id, "Block", id);
							break;
						case 'DeleteFriend': alterFriendShip(res, row.Id, "Delete", id);
							break;
						case 'UnBlockFriend': alterFriendShip(res, row.Id, "unBlock", id);
							break;
					}
					
				})
				.on('end', function(result) { //this point no user found
					done();
		   		if(result.rowCount == 0){
		   			console.log("relationship does not exists");
						return res.json({success: false, data: {message: "No request"}});
		   		}
	    		});  
			}
			 
	   });	
}

function getPendingRequests(res, id){
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	     return res.status(500).json({success: false, data: err});
	    } 
	    	var friends = [];
			var query = client.query('SELECT u1."UserName" As inituser, f."InitUser" FROM "Friendship" f JOIN "Users" u1 ON u1.uid = f."InitUser" where (f."RecUser" = $1) AND f."Active" = $2 AND f."Blocked" = $3',
	   	[id, false, false], function(err, result){
					if(err){
						console.error('error running query', err);
						return res.json({success: false, data: err});
					}
				})
				.on('row', function(row){
					userName = row.inituser;
					recId = row.InitUser;					
					var friend = {username: userName, Id: recId};
					friends.push(friend);
				})
				.on('end', function(result) { //this point no user found
		   		done();
		   		return res.json({success: true, data: {friends}});		
	    		});   
	   });	
}

function alterFriendShip(res, id, action, uid){ //uid only used for unBlock to check user unblocking was one who blocked //actually need it so i can store who blocked
	pool.connect((err, client, done) => {
	 // Handle connection errors
	 if(err) {
	 	done();
	   console.log(err);
	   return res.status(500).json({success: false, data: err});
	 } 
	 if(action == "Delete"){ //delete
	 	var query = client.query('DELETE FROM "Friendship" where "Id" = $1 ',
		[id], function(err, result){
		
		    if(err) {
		    	done();
		      //console.error('error running query', err);
		      return res.json({success: false, data: err});
		    }
	    	// SQL Query > Select Data
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
		     done();
		     return res.json({success: true, data: {message: "Deleted"}});
		    });
		});
	 }
	 else if (action == "Block"){ //block
	 	var query = client.query('UPDATE "Friendship" SET "Active" = $1, "Blocked" = $2, "InitBlockUser" = $4 where "Id" = $3 ',
		[true, true, id, uid], function(err, result){
		
		    if(err) {
		    	done();
		      console.error('error running query', err);
		      return res.json({success: false, data: err});
		    }
	    	// SQL Query > Select Data
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
		     done();
		     return res.json({success: true, data: {message: "Blocked"}});
		    });
		});
	 }
	 else{
		 var query = client.query('UPDATE "Friendship" SET "Active" = $1, "Blocked" = $2, "InitBlockUser" = $5 where "Id" = $3 AND "InitBlockUser" = $4 ',
		[true, false, id, uid, null], function(err, result){
		
		    if(err) {
		    	done();
		      console.error('error running query', err);
		      return res.json({success: false, data: err});
		    }
	    	// SQL Query > Select Data
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
		     done();
		     return res.json({success: true, data: {message: "UnBlocked"}});
		    });
		}); 
	 }
		
	});	
}