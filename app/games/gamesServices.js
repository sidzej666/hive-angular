angular.module('theHive')
    .service('gamesService', ['$http', 'restServiceUrl',
        function ($http, restServiceUrl) {
        
        this.getGames = function () {
			var responseData;
            $http.get(restServiceUrl + 'users//1')
            .success(function(data, status, headers, config) {
            	responseData = data;
        	})
        	.error(function(data, status, headers, config) {
        	});
		}
	}]);