const uuid = require('uuid');

function StorageException(message) {
	this.message = message;
	this.name = "StorageException";
}

const ProductDetails = {
	create: function(partNumber, description, quantity, price, supplierId, dateQuoted) {
		const product = {
			id: uuid.v4(),
			partNumber: partNumber,
			description: description,
			quotation: 
			{
				quantity: quantity,
				price: price,
				supplierId: supplierId,
				dateQuoted: dateQuoted || Date.now()
			}
		};
		this.products.push(product);
		return product;
	},
	get: function(partNumber=null) {
		if (partNumber !== null) {
			return this.products.find(product => product.partNumber === partNumber);
		}

		return this.products.sort(function(a,b) {
			return b.partNumber - a.partNumber
		});
	}
};

function createProductDetailsModel() {
	const storage = Object.create(ProductDetails);
	storage.products = [];
	return storage;
}

module.exports = {ProductDetails: createProductDetailsModel()};
