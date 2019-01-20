const express = require('express')
const bodyParser = require('body-parser')
const { routes } = require('./index');
const port = 3001 // port
const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))
// set CORS
app.use(function(req, res, next) {
	let origins = ['localhost']

	if (req.headers.origin) {
		for (let i = 0; i < origins.length; i++) {
			let origin = origins[i]
			if (req.headers.origin.indexOf(origin) > -1) {
				res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
			}
		}
	}
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, id, token, login_uuid')
	next()
});

// mount the routes
app.use(routes);

app.listen(port, function(err) {
	if (err) {
		throw err
	}

	console.log(`server is listening on ${port}!`)
});