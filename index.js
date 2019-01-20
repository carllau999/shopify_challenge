const express = require('express')
const pool = require('./database')
const app = express()

//mount routes for APIs calling carts
app.use('/cart', require('./cart'))

//mount routes for APIs querying products
app.use('/products', require('./products'))


module.exports = {
	routes: app
}
