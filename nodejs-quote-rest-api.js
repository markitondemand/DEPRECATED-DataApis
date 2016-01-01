var express = require('express');
var app = express();
var request = require('request');

app.get('/api/v1/markit/search/:ticker', function(req, res){

    var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=' + req.params.ticker;

    request(url).pipe(res);

});

app.listen(5000, function(){
	console.log('listening on port 5000');
});
