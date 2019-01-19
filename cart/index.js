const app = module.exports = require('express')();
const TokenGenerator = require('token-generator')
const pool = require('.././database')
var token_gen = new TokenGenerator({
	salt: "abcDEF123",
	timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes
});
token_gen.expiresOn = 2 * 60 * 60 // token expires in 2 hrs
const {
	verify_product,
	purchase_product,
	get_products
} = require('.././models/cart_model')

// All routes caught here has to start with /cart

/**
 * Creates a cart
 * @return {str}    Returns a string representing the cart's token
 */
app.post('/create', async (req, res) => {

	let token = token_gen.generate()
	try {
		let result = await pool.query("INSERT INTO carts (token, products) VALUES (?, '');", [token])
		return res.send({
			msg: "Cart token is: " + token
		})
	} catch (err) {
		return res.status(400).send({
			msg: 'Cart creation failed',
			error: err.message
		});
	}
})

/**
 * Adds a product to an existing cart
 * @param  {str} token   Token assigned to cart 
 * @param  {int} id  A product's id
 * @return {JSON}    JSON representing whether adding the product was successful
 */
app.post('/add', async (req, res) => {
	let token = req.body.token
	let product_id = req.body.id
	if (token_gen.isValid(token)) {
		try {
			let products = await get_products(token)
			if(products.indexOf(product_id.toString()) > -1 ){
				throw new Error("Product already in cart")
			}
			products.push(product_id)
			let new_p_list = products.join(",")
			let update_cart = await pool.query("UPDATE carts SET products = ? WHERE token = ?;", [new_p_list, token])
			return res.send({
				msg: "Added to cart succesfully"
			})

		} catch (err) {
			return res.status(400).send({
				msg: "Unable to add product",
				error: err.message
			})
		}
	} else{
		return res.send(400).send({msg: "Invalid token"})
	}
})

/**
 * Purchases all the products in a cart
 * @param  {str} token 		Token of the cart
 * @return {JSON}    JSON representing whether the purchase was successful
 */
app.post('/purchase', async (req, res) => {
	let token = req.body.token
	if (token_gen.isValid(token)) {
		try {
			let products = await get_products(token)
			let product_id_inventory = []
			// verify all products can be purchased in the cart
			for (let i = 0; i < products.length; i++) {
				let product_id = products[i]
				let verify_result = await verify_product(product_id)
				product_id_inventory.push({
					id: verify_result.id,
					inventory_count: verify_result.inventory_count
				})
				if (verify_result.code == 'fail') {
					throw Error(verify_result.msg)
				}
			}
			// purchase all products in the car if no errors are thrown
			for (let j = 0; j < product_id_inventory.length; j++) {
				let product = product_id_inventory[j]
				let purchase_result = await purchase_product(product.id, product.inventory_count)
				if (purchase_result.code == 'fail') {
					throw Error(purchase_result.msg)
				}
			}
			return res.send({
				msg: "Succesfully purchased products in cart"
			})

		} catch (err) {
			return res.status(400).send({
				msg: "Unable to purchase products in cart",
				error: err.message
			})
		}
	}else{
		return res.send(400).send({msg: "Invalid token"})
	}
})
/**
 * Remove item in cart
 * @param  {str} token 		Token of the cart
 * @param  {int} id     id of the product being removed
 * @return {JSON}    JSON representing whether removing the product was successful
 */
app.post('/remove', async (req, res) => {
	let token = req.body.token
	let product = req.body.id
	if (token_gen.isValid(token)) {
		try {
			let products = await get_products(token)
			let index = products.indexOf(product.toString())
			if (index > -1) {
			  products.splice(index, 1);
			}else{
				throw new Error("Product not in cart")
			}

			let new_p_list = products.join(",")
			let update_cart = await pool.query("UPDATE carts SET products = ? WHERE token = ?;", [new_p_list, token])
			return res.send({
				msg: "Removed from cart succesfully"
			})			

		} catch (err) {
			return res.status(400).send({
				msg: "Unable to remove product from cart",
				error: err.message
			})
		}
	}else{
		return res.send(400).send({msg: "Invalid token"})
	}
})