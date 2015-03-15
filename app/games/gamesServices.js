angular.module('theHive')
    .service('gamesService', ['$http', 'base64', function ($http, base64) {

        var encodedUserNameAndPassword = base64.encode('pawel' + ':' + '1234567890');
        this.getGames = function () {
        	var req = {
			 	method: 'GET',
			 	url: 'http://localhost:8080/HiveServer/hello/aa'
			};
			var responseData;
            $http(req)
            .success(function(data, status, headers, config) {
            	responseData = data;
        	})
        	.error(function(data, status, headers, config) {
        		alert('error!');
        	});
		}
	}]);