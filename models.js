'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//const uuid = require('uuid');

/*
function StorageException(message) {
	this.message = message;
	this.name = "StorageException";
}
*/

const productDetailSchema = mongoose.Schema({
	partNumber: {type: String, required: true}, 
	description: {type: String},
	quotation: {type: Array, default: []}
/*	quotation: [{
		supplier: {type: String, required: true},
		quantity: {type: String}, 
		price: {type: Number, required: true},
		quoted: {type: Date, default: Date.now}
	}]
*/
});

productDetailSchema.methods.serialize = function() {

	return {
		id: this._id,
		partNumber: this.partNumber,
		description: this.description,
		quotation: this.quotation
/*			supplier: this.quotation[0].supplier,
			quantity: this.quotation.quantity,
			price: this.quotation.price,
			quoted: this.quotation.quoted
*/		
	};
};

/*
const ProductDetails = {



	create: function(partNumber, description, supplierId, quantity, price, dateQuoted) {
		const product = {
			id: uuid.v4(),
			partNumber: partNumber,
			description: description,
			quotation: 
				[{
					supplierId: supplierId,
					quantity: quantity,
					price: price,
			//		dateQuoted: dateQuoted || Date.now()
			// 		add this back in mongoDB
				 }]
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
	},
	delete: function(partNumber) {
		const productIndex = this.products.findIndex(
			product => product.partNumber === partNumber);
		if (productIndex > -1) {
			this.products.splice(productIndex, 1);
		} 
		else {
			throw new StorageException(
				`Can't update product \'${partNumber}\' because doesn't exist.`);
		}
	},
	update: function(updatedProduct) {
		const {id} = updatedProduct;
		const productIndex = this.products.findIndex(
			product => product.partNumber === updatedProduct.partNumber);
		if (productIndex > -1) {
			this.products[productIndex] = Object.assign(
				this.products[productIndex], updatedProduct);
			return this.products[productIndex];
		}
		else {
			throw new StorageException(
				`Can't update product \'${updatedProduct.partNumber}\' because doesn't exist.`);
		}
	}

	
};

function createProductDetailsModel() {
	const storage = Object.create(ProductDetails);
	storage.products = [];
	return storage;
}
*/

const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);

module.exports = {ProductDetail};
