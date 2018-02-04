'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {ProductDetails} = require('../models');

ProductDetails.create(
	'TS1TSSD420K', '1TB SATA3 2.5" SSD', 70, 84.95, '0001');
ProductDetails.create(
	'TS256GMTE820', '256GB PCIe NVMe M.2 2280 SSD 3D TLC', 100, 188.75, '0002');

router.get('/', (req, res) => {
	res.json(ProductDetails.get());
});

router.get('/:partNumber', (req, res) => {
	console.log(req.params);
	console.log(ProductDetails.get(req.params.partNumber.toUpperCase()));
	res.json(ProductDetails.get(req.params.partNumber.toUpperCase()));
});

module.exports = router;

		