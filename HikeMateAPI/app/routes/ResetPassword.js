module.exports = {
	ResetPassword: function (req, res, next){
		if((req.body.Uid == "" || req.body.Uid == undefined) || (req.body.code == "" || req.body.code == undefined) || (req.body.password == "" || req.body.password == undefined) ){ //empty
			return res.status(500).json({success: false, status: 500, data: {err: "One or more fields are empty"}});
		}	
	    
	},
	SendResetPassword: function (req, res, next){
		if((req.body.Email == "" || req.body.Email == undefined) && (req.body.UserName == "" || req.body.UserName == undefined)){ //both missing
			return res.status(500).json({success: false, status: 500, data: {err: "One or more fields are empty"}});
		}	
	}
	
}

//sendreset flow, finduser : generate code ? exit email not exist -> generateCode : sendEmail ? exit some error
//resetpassword flow, finduser : checkcode ? exit email not exist -> checkCode : resetPassword ? exit bad code

function generateCode(email){ //use email as a seed + salt + time
	//get salt from db or use some other unique thing better
	//random generate code with email + salt + time
	//store code in db
	//send email + code
}

function checkCode(code, email){ //use email in case they close the app and the app forgets uid for the reset(prob would have to request a new email sent anyway). s
	//get code from db based on email
}

function findUser(email){
	//find email in db
}

function sendEmail(email, code){
	//send emails
}

function resetPassword(password, email){
	//reset pword in db

}