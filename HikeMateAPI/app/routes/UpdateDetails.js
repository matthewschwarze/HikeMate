module.exports = {
	UpdatePassword: function (req, res, next){
	  // Grab data from http request
	 var results = [];
	 
	 //check if data is valid
	if(req.body.Uid === "" || req.body.Password === "" || req.body.NewPassword === ""){ //empty
		return res.status(500).json({success: false, status: 500, data: {err: "One or more fields cannot be blank"}});
	}
	var id = req.body.Uid;
	var password = req.body.Password;
	var newPassword = req.body.NewPassword
	if(id == friendId){
		return res.json({success: false, data: {message: "You can't be friends with yourself"}});
	}
	
	//check if user to add exists
		//check if invite already exists, if init id is in the recive column set active to true
		// else invite already sent, return pending invite
		recordExists(res, id, friendId);	
	}
}

function auth(res, id, pword){

}