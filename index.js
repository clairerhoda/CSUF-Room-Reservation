
const express = require('express')
const app = express()
app.set('port', 4000)

// To implement the logic to process the HTTP request for static files 
app.use(express.static(__dirname ))	// ./

app.listen(app.get('port'), function(){
	console.log('Express server started on http://localhost:' + app.get('port'));
	console.log(__dirname)
})
