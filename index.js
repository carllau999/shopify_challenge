const express = require('express')
const pool = require('./database')
const app = express()

//mount routes for APIs modifying carts
app.use('/cart', require('./cart'))
//mount routes for APIs querying products
app.use('/products', require('./products'))

/**
 * Returns an array of products that are available
 *
 * If /products is called then all products are returned
 *
 * If /products/some_integer is called then the products with inventory_count more than some_integer is returned
 *
 * Precondition: some_integer is an integer, else error is raised
 * 
 * @param  {int} 	Optional parameter: represents one less than minimum value of inventory_count to use in filtering
 * @return {Array}  Returns an array of products with their id, title, inventory_count, and price
 */
app.get('/products/:available?', async (req, res) => {
	let available = req.params.available
	console.log("available", available)
	if (available && !isNaN(available)) {
		console.log("available")
		let result = await pool.query('SELECT * FROM products WHERE inventory_count > ?;', [available])
		console.log(result)
		return res.send({
			results: result
		})
	} else if (available != undefined && isNaN(available)) {
		return res.status(400).send({
			"msg": "Input filter is not a number!"
		})
	} else {
		let result = await pool.query('SELECT * FROM products;')
		console.log(result)
		return res.send({
			results: result
		})
	}
})

/**
 * Returns the product with the id specified
 * @param  {int} id  	The products id
 * @return {JSON}       Returns the details of the product fetched or error message
 */
app.get('/products/id/:id', async (req, res) => {
	let product_id = req.params.id
	try {
		let product = await pool.query('SELECT * FROM products WHERE id = ?;', [product_id])
		if (product.length != 1) {
			throw new Error("Product id not found")
		}
		return res.send(product[0])
	} catch (err) {
		return res.status(400).send({
			msg: "Product fetch failed",
			error: err.message
		})
	}
})

module.exports = {
	routes: app
}
