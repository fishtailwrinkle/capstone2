var MOCK_PRODUCT_DETAILS = {
	"productDetails": [
		{
			"id": "1111111",
			"partNumber": "TS256GMTE820",
			"description": "256GB PCIe NVMe M.2 2280 SSD 3D TLC",
			"quantity": 100,
			"price": 188.75,
			"dateQuoted": 1470016976609
		},
		{
			"id": "2222222",
			"partNumber": "TS120GMTS930T",
			"description": "120GB SATA3 M.2 2280 SSD 3D TLC",
			"quantity": 15,
			"price": 80.00,
			"dateQuoted": 1470016976609
		},
		{
			"id": "3333333",
			"partNumber": "TS1TSSD420K",
			"description": "1TB SATA3 2.5\" SSD",
			"quantity": 200,
			"price": 310.05,
			"dateQuoted": 1470016976609
		},
		{
			"id": "7777777",
			"partNumber": "TS1GHR72V1H",
			"description": "8GB DDR4 2133 R-DIMM 15-15-15 2Rx8",
			"quantity": 25,
			"price": 119.99,
			"dateQuoted": 1470016976609
		}
	]
};

function getRecentStatusUpdates(callbackFn) {
	setTimeout(function() {callbackFn(MOCK_PRODUCT_DETAILS)}, 1);
}

// AR: setmax table column width
function displayStatusUpdates(data) {
	$('body').append('<table></table>');
	$('table').append(
		'<tr>' +
		'<th>Item</th><th>Part Number</th><th>Description</th><th>Quantity (pcs)</th><th>Unit Price ($)</th>' +
		'</tr>');

	for (index in data.productDetails) {
		let itemNumber = index;
		itemNumber++;

		$('table').append(
			'<tr>' + 
			'<td>' + itemNumber + '</td>' +
			'<td>' + data.productDetails[index].partNumber + '</td>' +
			'<td>' + data.productDetails[index].description + '</td>' +
//			'<td>' + data.productDetails[index].quantity + '</td>' +
			'<td>' + '' + '</td>' +
//			'<td>' + data.productDetails[index].price + '</td>' +
			'<td>' + '' + '</td>' +
			'</tr>');
	}
}

function getAndDisplayStatusUpdates() {
	getRecentStatusUpdates(displayStatusUpdates);
}

$(function() {
	getAndDisplayStatusUpdates();
});
