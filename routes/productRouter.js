'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {ProductDetail} = require('../models');

/*
ProductDetails.create(
	'TS1TSSD420K', '1TB SATA3 2.5" SSD', '0001', 70, 84.95);
ProductDetails.create(
	'TS256GMTE820', '256GB PCIe NVMe M.2 2280 SSD 3D TLC', '0002', 100, 188.75);
*/
router.get('/', (req, res) => {
	ProductDetail
		.find()
		.then(products => {
			res.json(products.map(product => product.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'something went terribly wrong'});
		});
//	res.json(ProductDetails.get());
});

router.get('/:partNumber', (req, res) => {
	ProductDetail
		.findOne({partNumber: req.params.partNumber.toUpperCase()})
		.then(product => res.json(product.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'something went terribly wrong'});
		});	
//	res.json(ProductDetails.get(req.params.partNumber.toUpperCase()));
});

//router.post('/', jsonParser, (req, res) => {
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['partNumber', 'description'];
	console.log(req.body);
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
			
		if (!(field in req.body)) {
			const message = `Missing \'${field}\' in request body!`;
			console.error(message);
			return res.status(400).send(message);
		} 
	}

	ProductDetail
		.create({
			partNumber: req.body.partNumber.toUpperCase(),
			description: req.body.description
		})
		.then(product => res.status(201).json(product.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
//	const item = ProductDetails.create(req.body.partNumber.toUpperCase(), req.body.description);
//	res.status(201).json(item);
});

router.delete('/:partNumber', (req, res) => {
	ProductDetail
		.deleteOne({partNumber: req.params.partNumber.toUpperCase()})
		.then(() => {
			res.status(204).json({message: 'success'});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
//	ProductDetails.delete(req.params.partNumber.toUpperCase());
//	console.log(`Deleted Product \'${req.params.partNumber.toUpperCase()}\'`);
//	res.status(204).end();
});

//router.put('/:partNumber', jsonParser, (req, res) => {
router.put('/:partNumber', jsonParser, (req, res) => {
//	const requiredFields = ['partNumber', 'description'];
	if (!(req.params.partNumber && req.body.partNumber && req.params.partNumber === req.body.partNumber)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});	
	}

	const updated = {};
	const updateableFields = ['description', 'quotation'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	//const test = {supplier:'McD', quantity: 9, price: 20};
	let test = req.body.quotation;

	ProductDetail
//		.findOneAndupdate({partNumber: req.params.partNumber}, {$push: {'quotation': {'supplier':'best buy', 'price': 30}}})
		.update(
			{partNumber: req.params.partNumber}, 
			{
				$set: updated, 
				/*$set: {
					quotation: test

				}*/
			}
		)
		//.findOneAndUpdate({partNumber: req.params.partNumber}, {$set: updated}, {new: true})
		.then(() => res.status(204).end())
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});


/*
	if (req.params.partNumber.toUpperCase() !== req.body.partNumber.toUpperCase()) {
		const message = `Request path id (${req.params.partNumber.toUpperCase()}) and request body id (${req.body.partNumber.toUpperCase()}) must match.`;
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating product \'${req.params.partNumber.toUpperCase()}\' details.`);
	const item = ProductDetails.update({
		partNumber: req.body.partNumber.toUpperCase(),
		description: req.body.description
	});
	res.status(204).end();
*/

});

//router.put quotation based on supplier id


module.exports = router;

		