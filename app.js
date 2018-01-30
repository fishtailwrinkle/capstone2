var MOCK_PRODUCT_DETAILS = {
	"productDetails": [
		{
			"id": "1111111",
			"partNumber": "TS256GMTE820",
			"description": "256GB PCIe NVMe M.2 2280 SSD 3D TLC",
			"quotation": [
			{
				"quantity": 100,
				"price": 188.75,
				"supplierId": "111101",
				"dateQuoted": 1470016976609
			},
			{	"quantity": 100,
				"price": 185.00,
				"supplierId": "111102",
				"dateQuoted": 1470016976609
			}]
		},
		{
			"id": "2222222",
			"partNumber": "TS120GMTS930T",
			"description": "120GB SATA3 M.2 2280 SSD 3D TLC",
			"quotation": [
			{
				"quantity": 30,
				"price": 100.00,
				"supplierId": "111101",
				"dateQuoted": 1470016976609
			},
			{	"quantity": 30,
				"price": 95.00,
				"supplierId": "111102",
				"dateQuoted": 1470016976609
			}]
		},
		{
			"id": "3333333",
			"partNumber": "TS1TSSD420K",
			"description": "1TB SATA3 2.5\" SSD",
			"quotation": [
			{
				"quantity": 70,
				"price": 84.95,
				"supplierId": "111101",
				"dateQuoted": 1470016976609
			},
			{	"quantity": 70,
				"price": 77.00,
				"supplierId": "111102",
				"dateQuoted": 1470016976609
			}]
		},
		{
			"id": "7777777",
			"partNumber": "TS1GHR72V1H",
			"description": "8GB DDR4 2133 R-DIMM 15-15-15 2Rx8",
			"quotation": [
			{
				"quantity": 200,
				"price": 200.00,
				"supplierId": "111101",
				"dateQuoted": 1470016976609
			},
			{	"quantity": 200,
				"price": 190.00,
				"supplierId": "111102",
				"dateQuoted": 1470016976609
			}]
		}
	]
};

let rfqList = [];
let qtyList = [];
let itemNumber = 0;
	
function getProductDetails(query, callbackFn) {
	let queryFound = 0;
	let queryExisted = 0;
	$('.rfq-query').empty();

	MOCK_PRODUCT_DETAILS.productDetails.forEach(product => {
		if (query.toUpperCase() === product.partNumber.toUpperCase()) {
			//setTimeout(function() {callbackFn(MOCK_PRODUCT_DETAILS)}, 1);
			queryFound = 1;

			if (!rfqList.includes(product)) {
				rfqList.push(product);
//				setTimeout(function() {callbackFn(product)}, 1);
				setTimeout(function() {callbackFn()}, 1);
				console.log("print!");
			}
			else {
				$('.rfq-query').append(`<p>${query.toUpperCase()} already exists on this list.</p>`);	
				console.log("Part number is already added to this list.");				
			}
		}
	});
	if (!queryFound) {
			$('.rfq-query').append(`<p>${query} not found. Add new entry?</p>`);	
	}
}

function displayTable() {
	$('.rfq-data').empty();
	$('.rfq-data').append(
		'<form>' +
			'<table>' +
				'<tr class="table-header">' +
				'<th>Part Number</th>' + 
				'<th>Description</th>' +
				'</tr>' +
			'</table>' +
		'</form>');
}

// AR: setmax table column width
//function displayProductDetails(data) {
function displayProductDetails() {
	console.log('DISPLAY!!');

	displayTable();

	$('table').after('<button class="js-qty-button">Enter Quantity</button>');

	rfqList.forEach(rfq => {
		$('table').append(
			'<tr>' +
			'<td>' + rfq.partNumber + '</td>' +
			'<td>' + rfq.description + '</td>' +
			'</tr>'
		);		
	});
}

function getProductQuantity() {
	$('.rfq-data').on('click', '.js-qty-button', event => {
		$('.rfq-search').empty();
		$('.js-qty-button').remove();
		$('table').after('<button class="js-submit-button">submit</button>');
		$(".table-header").append(
			'<th>Quantity (pcs)</th>'
		);

		$('tr').not(".table-header").append(
			'<td>' + `<input name="qty" type="number" required></input>` + '</td>'
		);	
	});	
}

function getProductPrice() {
	$('.rfq-data').on('click', '.js-submit-button', event => {
		// Save form input values into an array
		qtyList = $('form').serializeArray();
		qtyList.forEach(qty => {
			console.log("qty is: " + qty.value);
		});
		$('.js-submit-button').remove();

		displayTable();
		$(".table-header").append(
			'<th>Quantity (pcs)</th>' +
			'<th>Price ($)</th>'
		);

		rfqList.forEach((rfq, index) => {
			console.log("rfq is: " + rfq);
			console.log("index is: " + index);
			rfq.quotation.quantity = qtyList[index].value;
			$('table').append(
				'<tr>' +
				'<td>' + rfq.partNumber + '</td>' +
				'<td>' + rfq.description + '</td>' +
				'<td>' + rfq.quotation.quantity + '</td>' +
				'</tr>'
			);	
		});
		$('tr').not(".table-header").append(
			'<td>' + `<input name="price" type="number" required></input>` + '</td>'
		);			
	});
}

// Search database for a specific part
/*function getQuery() {

}*/

function getAndDisplayProductDetails() {
	let query;

	//getQuery();
	$('.js-search-button').click(event => {
		event.preventDefault();
		query = $('.js-search-query').val().trim();
		$('.js-search-query').val('');
		console.log("SEARCH!!! "+ query);
		getProductDetails(query, displayProductDetails);
	});

}

// Display html form elements for product search
function displayProductSearch() {
	$('.rfq-search').html(`
		<form class="js-search-form">
			<input type="text" class="js-search-query" required></input>
			<button type="button" class="js-search-button">Search</button>
			<button type="button">Add Product</button>
		</form>`);
}

// Main function to make subfunction calls
$(function() {
	displayProductSearch();
	getAndDisplayProductDetails();
	getProductQuantity();
	getProductPrice();
});
