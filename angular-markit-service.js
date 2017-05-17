angular.module('MarkitDataApp')
	.service('GetTickerCorrect', function ($http) {
        function getQuote(searchParam) {
            return $http.get('/api/v1/markit/search/quote/' + searchParam).then(function (data) {
                return data;
            }, null);
        }

    	return {
        	getQuote: getQuote
    	}
    });
