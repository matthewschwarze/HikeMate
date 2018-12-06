const crypto = require('crypto');
const sha1 = require('sha1');
var nodemailer = require('nodemailer');
const seedrandom = require('seedrandom');
var config = require('../config'); // get our config file;
var transporter = nodemailer.createTransport(config.email);


module.exports = {
	ResetPassword: function (req, res, next){
		if((req.body.Email == "" || req.body.Email == undefined) || (req.body.code == "" || req.body.code == undefined) || (req.body.password == "" || req.body.password == undefined) ){ //empty
			return res.json({success: false, data: {err: "One or more fields are empty"}});
		}	
		findUser(req.body.Email, res, function(user){
				checkCode(user, res, req.body.code, function(user){
					//reset
					updatePassword(res, user.Uid, req.body.password);
				});
			
		});
	    
	},
	SendResetPassword: function (req, res, next){	
		if((req.body.Email == "" || req.body.Email == undefined))/* && (req.body.UserName == "" || req.body.UserName == undefined))*/{ //both missing
			return res.json({success: false, data: {err: "One or more fields are empty"}});
		}	
		findUser(req.body.Email, res, function(user){
				generateCode(user, res, function(code){
					sendEmail(req.body.Email, res, user, code);
				});
			
		});
	}
	
}

//sendreset flow, finduser ? generate code : exit email not exist -> generateCode ? sendEmail : exit some error
//resetpassword flow, finduser ? checkcode : exit email not exist -> checkCode ? resetPassword : exit bad code

function generateCode(user, res, callback){ //use email as a seed + salt + time
	//get salt from db or use some other unique thing better
	//random generate code with email + salt + time
	//store code in db
	//send email + code
	Math.seedrandom(user.Password + user.Uid + user.UserName + user.Email, { entropy: true });
	var code = Math.floor(100000 + Math.random() * 900000);

	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
	    } 
			
		var query = client.query('Update "Users" Set "Code" = $2 where "uid" = $1',
		[user.Uid, code], function(err, result){
			if(err){
				console.error('error running query', err);
				return res.json({success: false, data: err});
			}
		})
		.on('end', function(result) { //this point no user found
			if(result.rowCount == 0){
				return res.json({success: false, data: {message: "code Not updated"}});
			}else{
				console.log('updated');
				callback && callback(code);
			}
		});   
		
	   });	
}

function checkCode(user, res, subCode, callback){ //use email in case they close the app and the app forgets uid for the reset(prob would have to request a new email sent anyway). s
	//get code from db based on email
	var code;
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
	    } 
			
		var query = client.query('Select "Code" From "Users" Where "uid" = $1',
		[user.Uid], function(err, result){
			if(err){
				console.error('error running query', err);
				return res.json({success: false, data: err});
			}
		}).on('row', function(row) {
			code = row.Code;
			done();
					
	   }).on('end', function(result) {
			if(result.rowCount == 0){
				return res.json({success: false, data: {message: "code Not retrieved"}});
			}else{
				if(code == subCode){
					callback && callback(user);
				}else{
					return res.json({success: false, data: {message: "codes dont match!"}});
				}
			}
		});   
	});
	
}
//find user in db
function findUser(email, res, callback){
	//find email in db
	pool.connect((err, client, done) => {
		// Handle connection errors
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		var dbUsername;
		var dbPassword;
		var dbUid;
		var result = '';
		var queryString = 'SELECT "UserName", "Password", "uid" FROM "Users" WHERE "Email" = $1';
		var query = client.query({text: queryString, values: [email]}, function(err, result){
		}).on('row', function(row) {
			dbUsername = row.UserName;
			dbPassword = row.Password;
			dbUid = row.uid;
			done();
					
	   }).on('error', function() {
			console.error('error running query', err);
			done();
			return res.json({success: false, data: err});
		}).on('end', function(result) { //this point no user found
			
			if(result.rowCount == 1){ //must be the user as username is unique
				//check if password matches
				var user = {"UserName" : dbUsername, "Password" : dbPassword, "Uid" : dbUid, "Email" : email};
				callback && callback(user);
				
			}else{
				return res.json({success: false, data: {err: "no user found"}});
			}
		});
	}); 
}

function sendEmail(email, res, user, code){
	//generate email
	//send emails
	console.log(code + ", ok");
	var mailOptions = {
		from: 'hikemateapp@gmail.com',
		to: email,
		subject: 'Sending password reset code',
		text: 'Here is your code: ' + code
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			return res.json({success: false, data: {err: error}});
			console.log(error);
		} else {
			return res.json({success: true, data: {'Email sent: ': info.response}});;
		}
	});
}

function updatePassword(res, id, password){
	pool.connect((err, client, done) => {
	    // Handle connection errors
	    if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
	    } 
		var salt = crypto.randomBytes(256); 
		var NewSalt = sha1(salt); //encode salt
		var encodedpword =sha1(password + NewSalt); //un hashed pword with sha1 salt
			
		var query = client.query('Update "Users" Set "Password" = $2, "Code" = null, "Salt" = $3 where "uid" = $1',
		[id, encodedpword, NewSalt], function(err, result){
			if(err){
				console.error('error running query', err);
				return res.json({success: false, data: err});
			}
		})
		.on('end', function(result) { //this point no user found
			if(result.rowCount == 0){
				return res.json({success: false, data: {message: "Password Not Changed"}});
			}else{
				return res.json({success: true, data: {message: "Password Changed"}});
			}
		});   
		
	});	
}