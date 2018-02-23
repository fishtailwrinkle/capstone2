'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const {ProductDetails} = require('../models');
const {app} = require('../app');
//const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//Add one test that verifies that when you hit up the root url 
//for your client, you get a 200 status code and HTML.
describe('Connects to server', function() {
	it('should get an HTML file', function() {
		return chai.request(app)
		.get('/')
		.then(function(res) {
			expect(res).to.have.status(200);
		});
	});
});

//GET
describe('GET endpoint', function() {
	it('should return all existing product with details', function() {
		let res;
		return chai.request(app)
			.get('/products')
			.then(function(_res) {
				res = _res;
				expect(res).to.have.status(200);
				expect(res.body).to.have.length.of.at.least(1);
				//return ProductDetails.count();
			});
	});
});



