const PRODUCT_DETAILS_URL = "http://localhost:8080/products/";

let rfqList = [];
let qtyList = [];
let itemNumber = 0;
	
function getProductDetails(searchTerm, callbackFn) {
//	let queryFound = 0;
	$('.rfq-query').empty();

	const PRODUCT_SEARCH_URL = PRODUCT_DETAILS_URL+searchTerm.toUpperCase();
	console.log("URL is "+PRODUCT_SEARCH_URL);

		$.getJSON(PRODUCT_SEARCH_URL, callbackFn)
			.done((data) => {
				console.log(data);
			})
			.fail(() => {
				$('.rfq-query').append(`<p>${searchTerm} not found. Add new entry?</p>`);	
			});
		//		setTimeout(function() {callbackFn(product)}, 1);
		//setTimeout(function() {callbackFn()}, 1);
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
function displayProductDetails(data) {
	console.log("DISPLAY!!");
	if (rfqList.includes(data)) {
		$('.rfq-query').append(`<p>${data.partNumber.toUpperCase()} already exists on this list.</p>`);	
		console.log("Part number is already added to this list.");				
	}
	else {
		rfqList.push(data);

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
