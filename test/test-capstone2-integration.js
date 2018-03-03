'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {ProductDetail} = require('../models');
const {app} = require('../app');
const {runServer, closeServer} = require('../bin/server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedProductData() {
	const seedData = [];

	for (let i=1; i<=10; i++) {
		seedData.push(generateProductData());
	}

	return ProductDetail.insertMany(seedData);
}

function generateProductData() {
	return {
		partNumber: faker.lorem.word().toUpperCase(),
		description: faker.lorem.sentence(),
		quotation: [
		{
			supplier: faker.company.companyName(),
			quantity: faker.random.number(100),
			price: faker.random.number(100,2),
			date: faker.date.past()	
		},
		{
			supplier: faker.company.companyName(),
			quantity: faker.random.number(100),
			price: faker.random.number(100,2),
			date: faker.date.past()	
		}]
	};
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Products API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedProductData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('GET endpoint', function() {
		it('should return all existing products', function() {
			let res;
			return chai.request(app)
			//Use actual route defined in app.js instead of productRouter.js
				.get('/products')	
				.then(function(_res) {
		//			console.log(_res.body);
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.have.length.of.at.least(1);
					return ProductDetail.count();
				})
				.then(function(count) {
					expect(res.body).to.have.length(count);
				});
		});		

		it('should return products with correct fields', function() {
			let resProduct;
			return chai.request(app)
				.get('/products')
				.then(function(res) {
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');

					res.body.forEach(function(product) {
						expect(product).to.be.a('object');
						expect(product).to.include.keys(
							'id', 'partNumber', 'description', 'quotation');
					});
					resProduct = res.body[0];
					return ProductDetail.findOne({partNumber: resProduct.partNumber});
				})
				.then(function(product) {
					expect(resProduct.id).to.equal(product.id);
					expect(resProduct.partNumber).to.equal(product.partNumber);
					expect(resProduct.description).to.equal(product.description);
					expect(resProduct.quotation[0].supplier).to.equal(product.quotation[0].supplier);
					expect(resProduct.quotation[0].quantity).to.equal(product.quotation[0].quantity);
					expect(resProduct.quotation[0].price).to.equal(product.quotation[0].price);
				}); 
		});

		it('should return existing product by part number', function() {
			let resProduct;
			return ProductDetail
				.findOne()
				.then(function(product) {
					return chai.request(app)
						.get(`/products/${product.partNumber}`);
				})
				.then(function(res) {
					resProduct = res.body;
					expect(res).to.have.status(200);
					return ProductDetail.findOne({partNumber:res.body.partNumber});
				}) 
				.then(function(product) {
					expect(product.description).to.equal(resProduct.description);
					expect(product.quotation[0].supplier).to.equal(resProduct.quotation[0].supplier);
					expect(product.quotation[0].quantity).to.equal(resProduct.quotation[0].quantity);
					expect(product.quotation[0].price).to.equal(resProduct.quotation[0].price);
				});		
		});
	});

	describe('POST endpoint', function() {
		it('should add a new product', function() {
			
			const newProduct = generateProductData();
			let mostRecentQuote;

			return chai.request(app)
				.post('/products')
				.send(newProduct)
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys(
						'id', 'partNumber', 'description', 'quotation');
					expect(res.body.id).to.not.be.null;
					expect(res.body.partNumber).to.equal(newProduct.partNumber);
					expect(res.body.description).to.equal(newProduct.description);
				
					mostRecentQuote = newProduct.quotation.sort(
						(a,b) => b.date-a.date)[0].price;

					return ProductDetail.findOne({partNumber: res.body.partNumber});
				})			
				.then(function(product) {
					expect(product.partNumber).to.equal(newProduct.partNumber);
					expect(product.description).to.equal(newProduct.description);
					expect(product.quotation.supplier).to.equal(newProduct.quotation.supplier);
					expect(product.quotation.quantity).to.equal(newProduct.quotation.quantity);
					expect(product.quotation.price).to.equal(newProduct.quotation.price);
				});
		});
	});

	describe('PUT endpoint', function() {
		it('should update fields sent over', function() {
			const updateData = {
				description: 'Breakfast blend famous tea',
				quotation: [
					{
						supplier: 'Fortnum & Mason',
						quantity: 30,
						price: 20
					}]
			};

			return ProductDetail
				.findOne()
				.then(function(product) {
					updateData.partNumber = product.partNumber;	
					return chai.request(app)
						.put(`/products/${product.partNumber}`)
						.send(updateData);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return ProductDetail.findOne({partNumber:updateData.partNumber});
				}) 
				.then(function(product) {
					expect(product.description).to.equal(updateData.description);
					expect(product.quotation[0].supplier).to.equal(updateData.quotation[0].supplier);
					expect(product.quotation[0].quantity).to.equal(updateData.quotation[0].quantity);
					expect(product.quotation[0].price).to.equal(updateData.quotation[0].price);		
				})
		});
	});	

	describe('DELETE endpoint', function() {
		it('delete a product by part number', function() {
			let product;

			return ProductDetail
				.findOne()
				.then(function(_product) {
					product = _product;
					return chai.request(app)
						.delete(`/products/${product.partNumber}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return ProductDetail.findOne({partNumber: product.partNumber});
				})
				.then(function(_product) {
					expect(_product).to.be.null;
				});
		});
	});
});


