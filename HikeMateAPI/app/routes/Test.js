module.exports = {
	Test: function(req, res) {
		var port = process.env.PORT || 8080;
	    res.send('Hello! The API is at http://localhost:' + port + '/api');
	}
}