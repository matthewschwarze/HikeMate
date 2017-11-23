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

function generateCode(email){ //use email as a seed + salted password??, issues; hacker could submit user email and reverse engineer because code(known) = email (known) + saltedPwd(not known), would be hard to get pword and salt as they are unknown so should be safe
	//store code in db
}

function checkCode(code, email){ //use email in case they close the app and the app forgets uid for the reset(prob would have to request a new email sent anyway). s
	
}

function findUser(email){
	
}

function sendEmail(email, code){
	
}

function resetPassword(password, email){
	

}