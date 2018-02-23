const PRODUCT_DETAILS_URL = "http://localhost:8080/products/";

let rfqList = [];
let qtyList = [];
let itemNumber = 0;

let getData = {};
let addData = {};

function getProductDetails(searchTerm, callbackFn) {
//	let queryFound = 0;
	$('.rfq-action').empty();
	$('.content-left').empty();
	//$('.content-right').empty();
	//$('.create-quote').empty();
	//$('.list-quote').empty();

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


//				addData.partNumber = searchTerm;	
				getData.partNumber = searchTerm;	
				$('.rfq-action').append(`
					<p>${searchTerm} is not in the database.</p>
					<button class="js-create-btn">Add New Product</button>
					<button>Cancel</button>`);	
			});
		//		setTimeout(function() {callbackFn(product)}, 1);
		//setTimeout(function() {callbackFn()}, 1);
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

/*
		if (typeof getData.quotation === 'undefined') {
			console.log('length is undefined!');
			arrayIndex = 0;
			getData.quotation = [];
		} 
		else {
			console.log('length is: '+getData.quotation.length);
			arrayIndex = getData.quotation.length;
		}
*/
			console.log('length is: '+getData.quotation.length);
			let arrayIndex = getData.quotation.length;

			getData.quotation[arrayIndex] = {
				supplier: $('.js-input-supplier').val(),
				quantity: $('.js-input-quantity').val(),
				price: $('.js-input-price').val()
			};

			console.log(getData);
/*
			getData.quotation[arrayIndex].supplier = $('.js-input-supplier').val(); 
			getData.quotation[arrayIndex].quantity = $('.js-input-quantity').val(); 
			getData.quotation[arrayIndex].price = $('.js-input-price').val(); 
*/
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
				//$('.content-right').empty();
				$('.create-quote').empty();
				$('.list-quote').empty();
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
			//'<form>' + 
			`<h3>Part Number</h3>` +
//			`<input id="part-number" value='${addData.partNumber}' required></input>` +
			`<p>${getData.partNumber}</p>` +
			`<h3>Description</h3>` +
			'<input id="description" required></input><br>' +
			`<button class="js-saveNew-btn">Save</button>` +
			`<button class="js-cancelNew-btn">Cancel</button>`);
	});
}

function saveNewProductDetails() {
	$('.rfq-action').on('click', '.js-saveNew-btn', event => {
//		addData.description = $('#description').val();
		getData.description = $('#description').val();
		getData.quotation = []; 

		$.ajax({
			method: "POST",
			url: PRODUCT_DETAILS_URL,
			dataType: "json",
//			data: JSON.stringify(addData),
			data: JSON.stringify(getData),
			contentType: 'application/json'
		})
		.done(() => {
//			displayProductDetails(addData);
			displayProductSearch();
			displayProductDetails(getData);
			$('.rfq-action').empty();
		});
	});

}

function cancelNewProductDetails() {

}

/*
function displayTable() {
	$('.content-left').empty();
	$('.content-left').append(
		'<form>' +
			'<table>' +
				'<tr class="table-header">' +
				'<th>Part Number</th>' + 
				'<th>Description</th>' +
				'</tr>' +
			'</table>' +
		'</form>');
}
*/
// AR: setmax table column width
function displayProductDetails(data) {
	console.log("DISPLAY!!");

	//$('.create-quote').empty();
			//!jQuery.isEmptyObject(data.quotation[0])) {
/*	if (rfqList.includes(data)) {
		$('.rfq-action').append(`<p>${data.partNumber.toUpperCase()} already exists on this list.</p>`);	
		console.log("Part number is already added to this list.");				
	}
	else {
*/
		rfqList.push(data);
		//displayTable();

		//$('table').after(
		$('.content-left').html(
			'<h2>Product Details</h2>' +
			`<p>${data.partNumber}</p>` +
			`<p>${data.description}</p>` +
			'<button class="js-edit-btn">Edit</button>');

		$('.create-quote').html(
			`<h2>Quotation</h2>` +
			'<button class="js-addQuote-btn">Create New Quotation</button><br>');

		if (typeof data.quotation !== 'undefined' && 
			data.quotation.length > 0 && 
			!jQuery.isEmptyObject(data.quotation[0])) {

			console.log(data.quotation[0]);


/////////////////////////////////////////////////////////////
/*
			data.quotation.forEach((quote, index) => {
			$('.content-right').append(
//				`<h3>Supplier Name</h3>` +
				`<p>${quote.supplier}</p>` + 
//				`<h3>Quantity</h3>` +
				`<p>${quote.quantity}pcs @ $${quote.price}/ea</p>` +
				//`<button class='js-editQuote${index}-btn'>Edit</button>` +
//				`<button class='js-deleteQuote${index}-btn'>Delete</button>`
				`<button class='js-delete-quote'>Delete</button>`);
			});
*/
		const quotesString = generateQuotesString(data);	
		$('.list-quote').html(quotesString);
//		$('.content-right').html(quotesString);
/////////////////////////////////////////////////////////////


	}
	else {
		$('.list-quote').empty();
	}


		$('.content-center').html(
			'<button class="js-addList-btn">Add to RFQ</button>' +
			'<button class="js-deleteDb-btn">Delete</button>');
/*
		rfqList.forEach(rfq => {
			$('table').append(
				'<tr>' +
				'<td>' + rfq.partNumber + '</td>' +
				'<td>' + rfq.description + '</td>' +
				'</tr>'
			);		
		});

	}

*/

}

function generateQuoteElement(quote, quoteIndex) {
	return `
		<li class="js-quote-index-element">
			<div>
				<p>${quote.supplier}</p>
				<p>${quote.quantity}pcs @ $${quote.price}/ea</p>	
			</div>
			<div>
				<button class="js-quote-delete">
					<span>Delete</span>
				</button>
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
	//const quoteIndexString = $(quote)
	//	.closest('.js-')

}

function deleteProductQuote() {
	$('.content-right').on('click', '.js-delete-quote', event => {
		const quoteIndex = getQuoteIndex(event.currentTarget);
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
/*
*/
} 


/*
function getProductQuantity() {
	$('.content-left').on('click', '.js-qty-button', event => {
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
	$('.content-left').on('click', '.js-submit-button', event => {
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
*/

function getAndDisplayProductDetails() {
	let query;

	//getQuery();
	$('.rfq-search').on('click', '.js-search-button', event => {
		event.preventDefault();
		query = $('.js-search-query').val().toUpperCase().trim();
		$('.js-search-query').val('');
		console.log("SEARCH!!! "+ query);
		getProductDetails(query, displayProductDetails);
	});

}

// Display html form elements for product search
function displayProductSearch() {
	$('.rfq-search').html(`
		<form class="js-search-form">
			<label>Enter a part number to add or retrieve product details</label><br>
			<input type="text" class="js-search-query" required></input>
			<button type="button" class="js-search-button">Search</button><br>
		</form>`);
}

function displayProductAction() {
/*	$('.rfq-menu').html(`
		<button type="button" class="js-saveProduct-btn">Edit</button><br>
		<button type="button" class="js-deleteDb-btn">Delete</button>`);
*/
}

// Main function to make subfunction calls
$(function() {
	displayProductSearch();
	displayProductAction();
	getAndDisplayProductDetails();
	addProductDetails();
	saveNewProductDetails();
	cancelNewProductDetails();
	editProductDetails();
	saveProductDetail();
	deleteProductDetails();
	addProductQuote();
	saveProductQuote();
//	getProductQuantity();
//	getProductPrice();
});
