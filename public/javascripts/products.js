//const PRODUCT_DETAILS_URL = "http://localhost:8080/products/";
const PRODUCT_DETAILS_URL = "https://glacial-gorge-20797.herokuapp.com/products/";

let rfqList = [];
let qtyList = [];
let itemNumber = 0;

let getData = {};
let addData = {};

function getProductDetails(searchTerm, callbackFn) {
	$('.rfq-action').empty();
	$('.content-left').empty();
	$('.content-left').removeClass('display-border');		
	$('.content-center').empty();
	
	const PRODUCT_GET_URL = PRODUCT_DETAILS_URL+searchTerm;
	console.log("URL is "+PRODUCT_GET_URL);

		$.getJSON(PRODUCT_GET_URL, callbackFn)
			.done((data) => {
				getData = data;
				console.log(data);
			})
			.fail(() => {
				$('.create-quote').empty();
				$('.list-quote').empty();
				$('.content-right').removeClass('display-border');
				getData.partNumber = searchTerm;	
				$('.rfq-action').append(`
					<span>${searchTerm}</span><p> is not in the database</p>
					<button class="js-create-btn">Add New Product</button>
					<button>Cancel</button>`);	
			});
}

function saveProductDetail() {
	$('.content-left').on('click', '.js-saveProduct-btn', event => {
		const PRODUCT_PUT_URL = PRODUCT_DETAILS_URL+getData.partNumber;
		getData.description = $('.js-input-description').val();
		console.log(PRODUCT_PUT_URL);

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
	});
}

function saveProductQuote() {
	$('.content-right').on('click', '.js-saveQuote-btn', event => {
		console.log("Save quote~~~");
		const PRODUCT_PUT_URL = PRODUCT_DETAILS_URL+getData.partNumber;
		console.log('Part Number is: '+getData.partNumber);

		console.log('length is: '+getData.quotation.length);
		let arrayIndex = getData.quotation.length;

		getData.quotation[arrayIndex] = {
			supplier: $('.js-input-supplier').val(),
			quantity: $('.js-input-quantity').val(),
			price: $('.js-input-price').val()
		};

		console.log(getData);

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
	});
}

function deleteProductDetails() {

	$('.content-center').on('click', '.js-deleteDb-btn', event => {
		const PRODUCT_DELETE_URL = PRODUCT_DETAILS_URL+getData.partNumber;
		console.log('Deleting!!');	

		if (confirm("Are you sure you want to delete this product?")) {
			$.ajax({
				method: "DELETE",
				url: PRODUCT_DELETE_URL,
				dataType: "json"
			})
			.done(() => {
				$('.content-left').empty();
				$('.content-left').removeClass('display-border');
		
				//$('.content-right').empty();
				$('.create-quote').empty();
				//$('.create-quote').removeClass('display-border');
				$('.list-quote').empty();
				$('.content-right').removeClass('display-border');

				$('.content-center').empty();
			});
		} 
	});
}

function addProductDetails() {
	$('.rfq-action').on('click', '.js-create-btn', event => {
		console.log("Clicked Add!!");
		$('.rfq-search').empty();
		$('.rfq-action').empty();
		event.preventDefault();

		$('.rfq-action').append(
			`<h3>Part Number</h3>` +
			`<p>${getData.partNumber}</p>` +
			`<h3>Description</h3>` +
			'<input id="description" required></input><br>' +
			`<button class="js-saveNew-btn">Save</button>` +
			`<button class="js-cancelNew-btn">Cancel</button>`);
	});
}

function saveNewProductDetails() {
	$('.rfq-action').on('click', '.js-saveNew-btn', event => {
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
		});
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
		`<h2>Quotation</h2>` +
		'<button class="js-addQuote-btn">Create New Quotation</button><br>'
	);
}


// AR: setmax table column width
function displayProductDetails(data) {
	console.log("DISPLAY!!");
		rfqList.push(data);

		$('.content-left').addClass('display-border');
		$('.content-right').addClass('display-border');

		$('.content-left').html(
			'<h2>Product Details</h2>' +
			`<p>${data.partNumber}</p>` +
			`<p>${data.description}</p>` +
			'<button class="js-edit-btn">Edit</button>');

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


		$('.content-center').html(
			//////////////////////Enable later///////////////////////
			//'<button class="js-addList-btn">Add to RFQ</button>' +
			'<button class="js-deleteDb-btn">Delete</button>');

}

function generateQuoteElement(quote, quoteIndex) {
	//const date = quote.date.slice(0,10);
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

		console.log(PRODUCT_PUT_QUOTE_URL);
		console.log(quoteData);

		if (confirm("Are you sure you want to delete this quote?")) {
			$.ajax({
				method: "PUT",
				url: PRODUCT_PUT_QUOTE_URL,
				dataType: "json",
				data: JSON.stringify(quoteData),
				contentType: 'application/json'
			})
			.done(() => {
				console.log("DELETING");
				getProductDetails(getData.partNumber, displayProductDetails);
			});	
		}
	});
}

function editProductDetails() {
	let count = 0;

	$('.content-left').on('click', '.js-edit-btn', event => {
		console.log(count++);

		$('.js-edit-btn').attr('disabled', 'disabled');
		$('.content-left').empty();
		console.log('EDITING!!!');
		$('.content-left').html(
			'<h2>Product Details</h2>' +
			'<h3>Part Number</h3>' +
			`<p>${getData.partNumber}</p>` +
			'<h3>Description</h3>' +
			`<input class="js-input-description" value='${getData.description}'></input><br>` +
			'<button class="js-saveProduct-btn">Save</button>');
	});
}

function addProductQuote() {
	$('.content-right').on('click', '.js-addQuote-btn', event => {
		console.log("Add new quote!!!!!!!!!!!!!");
		//$('.content-right').empty();
		//$('.js-addQuote-btn').attr('disabled', 'disabled');
		//$('.content-right').html(
		$('.create-quote').html(
			'<h2>Quotation</h2>' +
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
		console.log("SEARCH!!! "+ query);
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
			<label>Enter a part number to add or retrieve product details</label><br>
			<input type="text" class="js-search-query" required></input>
			<button type="submit" class="js-search-button">Search</button><br>
		</form>`);
}

// Main function to make subfunction calls
$(function() {
	displayProductSearch();
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
//	getProductQuantity();
//	getProductPrice();
});
