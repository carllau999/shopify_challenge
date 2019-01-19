const pool = require('.././database')

/**
 * Verifies whether a product is available for purchase
 * @param  {int} product_id The id of the product being verified
 * @return {JSON}            JSON representing the results of the verification
 */
verify_product = async (product_id) => {
	try {
		let result = await pool.query('SELECT * FROM products WHERE id = ?;', [product_id])
		if (result.length == 1 && result[0].inventory_count > 0) {
			let new_inventory_count = result[0].inventory_count - 1 // since the product is available
			//the function returns inventory_count of the product minus 1
			return {
				code: 'success',
				msg: "Purchase verified",
				id: product_id,
				inventory_count: new_inventory_count
			}
		} else if (result.length != 1) {
			return {
				code: 'fail',
				msg: "Product not found"
			}
		} else {
			return {
				code: 'fail',
				msg: "Product inventory empty"
			}
		}
	} catch (err) {
		return {
			code: 'fail',
			msg: 'Verification failed',
			err
		}
	}
}

/**
 * Purchases a product by reducing its inventory count by one
 * @param  {int} product_id      The id of the product being purchased
 * @param  {int} inventory_count The inventory count of the product after being purchased
 * @return {JSON}                 JSON representing whether the purchase was successful
 */
purchase_product = async (product_id, inventory_count) => {
	try {
		let purchase_product = await pool.query('UPDATE products SET inventory_count = ? WHERE id = ?;', [inventory_count, product_id])
		return {
			code: 'success',
			msg: "Succesful purchase"
		}
	} catch (err) {
		return {
			code: 'fail',
			msg: 'Purchase failed',
			err
		}
	}
}

/**
 * Returns all the products of a cart
 * @param  {str} token  Token of the cart
 * @return {array}       Array of all the products in the cart
 */
get_products = async (token) => {

	let cart = await pool.query("SELECT * FROM carts WHERE token = ?;", [token])
	if (cart.length != 1) {
		throw Error("Unable to find token")
	}
	let products = cart[0].products == "" ? [] : cart[0].products.split(",") // retrieve carts products
	return products

}
module.exports = {
	verify_product,
	purchase_product,
	get_products
}