//const PRODUCT_DETAILS_URL = "http://localhost:8080/products/";
const PRODUCT_DETAILS_URL = "https://quote-unquote-thinkful.herokuapp.com/products/";

let rfqList = [];
let qtyList = [];
let itemNumber = 0;

let getData = {};
let addData = {};

function getProductDetails(searchTerm, callbackFn) {
	$('.rfq-action').empty();
	$('.rfq-action').removeClass('display-border');
	$('.content-left').empty();
	$('.content-left').removeClass('display-border');		
	
	const PRODUCT_GET_URL = PRODUCT_DETAILS_URL+searchTerm;

	$.getJSON(PRODUCT_GET_URL, callbackFn)
		.done((data) => {
			getData = data;
		})
		.fail(() => {
			$('.create-quote').empty();
			$('.list-quote').empty();
			$('.content-right').removeClass('display-border');
			getData.partNumber = searchTerm;
			$('.rfq-action').addClass('display-border');
			$('.rfq-action').append(`
				<span>${searchTerm}</span><p> is not in the database</p>
				<button class="js-create-btn">Add New Product</button>
				<button class="js-cancel-btn">Cancel</button>`);	
		});
}

function cancelNewProduct() {
	$('.rfq-action').on('click', '.js-cancel-btn', event => {
		$('.rfq-action').empty();
		$('.rfq-action').removeClass('display-border');
			
	});
}

function saveProductDetail() {
	$('.content-left').on('click', '.js-saveProduct-btn', event => {
		if ($('.js-input-description').val() !== '') {
			const PRODUCT_PUT_URL = PRODUCT_DETAILS_URL+getData.partNumber;
			getData.description = $('.js-input-description').val();

			$.ajax({
				method: "PUT",
				url: PRODUCT_PUT_URL,
				dataType: "json",
				data: JSON.stringify(getData),
				contentType: 'application/json'
			})
			.done(() => {
				displayProductDetails(getData);
			});	
		} 
		else {
			alert("Please enter a non-empty string for description!");
		}
	});
}

function saveProductQuote() {
	$('.content-right').on('click', '.js-saveQuote-btn', event => {
		if ($('.js-input-supplier').val() !== '' &&
			$('.js-input-quantity').val() !== '' &&
			$('.js-input-price').val() !== '') {

			const PRODUCT_PUT_URL = PRODUCT_DETAILS_URL+getData.partNumber;
			let arrayIndex = getData.quotation.length;

			getData.quotation[arrayIndex] = {
				supplier: $('.js-input-supplier').val(),
				quantity: $('.js-input-quantity').val(),
				price: $('.js-input-price').val()
			};

			$.ajax({
				method: "PUT",
				url: PRODUCT_PUT_URL,
				dataType: "json",
				data: JSON.stringify(getData),
				contentType: 'application/json'
			})
			.done(() => {
				getProductDetails(getData.partNumber, displayProductDetails);
			});
		} 
		else {
			alert("Please fill out all fields!");
		}
	});
}

function deleteProductDetails() {
	$('.content-left').on('click', '.js-deleteDb-btn', event => {
		const PRODUCT_DELETE_URL = PRODUCT_DETAILS_URL+getData.partNumber;

		if (confirm("Are you sure you want to delete this product?")) {
			$.ajax({
				method: "DELETE",
				url: PRODUCT_DELETE_URL,
				dataType: "json"
			})
			.done(() => {
				$('.content-left').empty();
				$('.content-left').removeClass('display-border');
				$('.create-quote').empty();
				$('.list-quote').empty();
				$('.content-right').removeClass('display-border');
			});
		} 
	});
}

function addProductDetails() {
	$('.rfq-action').on('click', '.js-create-btn', event => {
		$('.rfq-search').empty();
		$('.rfq-action').empty();
		$('.rfq-action').removeClass('display-border');

		event.preventDefault();

		$('.rfq-action').append(
			`<h3>Part Number</h3>` +
			`<p>${getData.partNumber}</p>` +
			`<h3>Description</h3>` +
			'<input id="description" required></input><br>' +
			`<button class="js-saveNew-btn">Save</button>` +
			`<button class="js-cancelNew-btn">Cancel</button>`);
		$('.rfq-action').addClass('display-border');
	});
}

function cancelAddNewProduct() {
	$('.rfq-action').on('click', '.js-cancelNew-btn', event => {
		$('.rfq-action').empty();
		$('.rfq-action').removeClass('display-border');
		displayProductSearch();
	});
}

function saveNewProductDetails() {
	$('.rfq-action').on('click', '.js-saveNew-btn', event => {
		if ($('#description').val() !== '') {
			getData.description = $('#description').val();
			getData.quotation = []; 

			$.ajax({
				method: "POST",
				url: PRODUCT_DETAILS_URL,
				dataType: "json",
				data: JSON.stringify(getData),
				contentType: 'application/json'
			})
			.done(() => {
				displayProductSearch();
				displayProductDetails(getData);
				$('.rfq-action').empty();
				$('.rfq-action').removeClass('display-border');

			});
		} 
		else {
			alert("Please enter a non-empty string for description!");
		}
	});
}

function cancelNewProductDetails() {
	$('.create-quote').on('click', '.js-cancelQuote-btn', event => {
		$('.create-quote').empty();
		renderCreateQuote();	
	});
}

function renderCreateQuote() {
	$('.create-quote').html(
		'<button class="js-addQuote-btn">Create New Quotation</button><br>'
	);
}

function displayProductDetails(data) {
	rfqList.push(data);

	$('.content-left').addClass('display-border');
	$('.content-right').addClass('display-border');

	$('.content-left').html(
		`<h3 class="p-left">${data.partNumber}</h3>` +
		`<p class="p-left">${data.description}</p>` +
		'<div>' +
		'<button class="js-edit-btn">Edit</button>' +
		'<button class="js-deleteDb-btn">Delete</button>' +
		'</div>');

	renderCreateQuote();

	if (typeof data.quotation !== 'undefined' && 
		data.quotation.length > 0 && 
		!jQuery.isEmptyObject(data.quotation[0])) {

		const quotesString = generateQuotesString(data);	
		$('.list-quote').html('<hr>'+quotesString);
	}
	else {
		$('.list-quote').empty();
	}
}

function generateQuoteElement(quote, quoteIndex) {
	return `
		<li class="js-quote-index-element" data-item-index="${quoteIndex}">
			<div>
				<p class="js-quote-supplier">${quote.supplier}</p>
				<span class="js-quote-quantity">${quote.quantity}</span><span>pcs @ $</span><span class="js-quote-price">${quote.price}</span><span>/ea</span>	
				<p class="js-quote-supplier">${quote.date.slice(0,10)}</p>
			</div>
			<div>
				<button class="js-delete-quote">Delete</button>
			</div>
		</li>
	`;
}

function generateQuotesString(data) {
	const quotes = data.quotation.map((quote, index) => 
	generateQuoteElement(quote, index));		

	return quotes.join("");
}

function getQuoteIndex(quote) {
	const quoteIndexString = $(quote)
		.closest('.js-quote-index-element')
		.attr('data-item-index');
	return parseInt(quoteIndexString, 10);
}

function deleteProductQuote() {
	const quoteData = {};
	$('.content-right').on('click', '.js-delete-quote', event => {
		const quoteIndex = getQuoteIndex(event.currentTarget);
		quoteData.partNumber = getData.partNumber;
		quoteData.quotation = getData.quotation[quoteIndex];
				
		const PRODUCT_PUT_QUOTE_URL = PRODUCT_DETAILS_URL+getData.partNumber+"/"+quoteIndex;

		if (confirm("Are you sure you want to delete this quote?")) {
			$.ajax({
				method: "PUT",
				url: PRODUCT_PUT_QUOTE_URL,
				dataType: "json",
				data: JSON.stringify(quoteData),
				contentType: 'application/json'
			})
			.done(() => {
				getProductDetails(getData.partNumber, displayProductDetails);
			});	
		}
	});
}

function editProductDetails() {
	let count = 0;
	$('.content-left').on('click', '.js-edit-btn', event => {
		$('.js-edit-btn').attr('disabled', 'disabled');
		$('.content-left').empty();
		$('.content-left').html(
			'<h3>Part Number</h3>' +
			`<p>${getData.partNumber}</p>` +
			'<h3>Description</h3>' +
			`<input class="js-input-description" value='${getData.description}'></input><br>` +
			'<button class="js-saveProduct-btn">Save</button>');
	});
}

function addProductQuote() {
	$('.content-right').on('click', '.js-addQuote-btn', event => {
		$('.create-quote').html(
			'<h3>Supplier Name</h3>' +
			`<input class="js-input-supplier"></input><br>` +
			`<h3>Quantity</h3>` +
			`<input class="js-input-quantity" type="number"></input>` +
			`<h3>Price</h3>` +
			`<input class="js-input-price" type="number"></input><br>` +
			'<button class="js-saveQuote-btn">Save</button>' +
			'<button class="js-cancelQuote-btn">Cancel</button>');
	});
} 

function getAndDisplayProductDetails() {
	let query;
	$('.rfq-search').on('click', '.js-search-button', event => {
		event.preventDefault();
		query = $('.js-search-query').val().toUpperCase().trim();
		$('.js-search-query').val('');
		if (query !== '') {
			getProductDetails(query, displayProductDetails);
		} 
		else {
			alert("Please enter a non-empty string for part number!");
		}
	});
}

// Display html form elements for product search
function displayProductSearch() {
	$('.rfq-search').html(`
		<form class="js-search-form">
			<label>Enter a part number for info</label><br>
			<input type="text" class="js-search-query" required></input>
			<button type="submit" class="js-search-button">Search</button><br>
		</form>`);
}

// Main function to make subfunction calls
$(function() {
	displayProductSearch();
	cancelNewProduct();
	cancelAddNewProduct();
	getAndDisplayProductDetails();
	addProductDetails();
	saveNewProductDetails();
	cancelNewProductDetails();
	editProductDetails();
	saveProductDetail();
	deleteProductDetails();
	addProductQuote();
	saveProductQuote();
	deleteProductQuote();
});
