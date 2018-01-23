var MOCK_PRODUCT_DETAILS = {
	"productDetails": [
		{
			"id": "1111111",
			"partNumber": "TS256GMTE820",
			"description": "256GB PCIe NVMe M.2 2280 SSD 3D TLC",
			"price": 190,
			"dateQuoted": 1470016976609
		},
		{
			"id": "2222222",
			"partNumber": "TS120GMTS930T",
			"description": "120GB SATA3 M.2 2280 SSD 3D TLC",
			"price": 80,
			"dateQuoted": 1470016976609
		},
		{
			"id": "3333333",
			"partNumber": "TS1TSSD420K",
			"description": "1TB SATA3 2.5\" SSD",
			"price": 310,
			"dateQuoted": 1470016976609
		},
		{
			"id": "7777777",
			"partNumber": "TS1GHR72V1H",
			"description": "8GB DDR4 2133 R-DIMM 15-15-15 2Rx8",
			"price": 125,
			"dateQuoted": 1470016976609
		}
	]
};

function getRecentStatusUpdates(callbackFn) {
	setTimeout(function() {callbackFn(MOCK_PRODUCT_DETAILS)}, 1);
}

function displayStatusUpdates(data) {
	for (index in data.productDetails) {
		$('body').append(
			'<p>' + data.productDetails[index].description + '</p>');
	}
}

function getAndDisplayStatusUpdates() {
	getRecentStatusUpdates(displayStatusUpdates);
}

$(function() {
	getAndDisplayStatusUpdates();
});
