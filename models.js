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
	quotation: [{
		supplier: {type: String, required: true},
		quantity: {type: Number, required: true}, 
		price: {type: Number, required: true},
		date: {type: Date, default: Date.now}
	}]

});

productDetailSchema.methods.serialize = function() {
	return {
		id: this._id,
		partNumber: this.partNumber,
		description: this.description,
		quotation: this.quotation
	};
};


/////////////////schema for add to RFQ

/////////////////schema for customers



const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);

module.exports = {ProductDetail};
