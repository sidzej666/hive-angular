'use strict';
 
angular.module('theHive')
  .controller('LoginCtrl', ['$scope', '$http', '$cookies', 'restServiceUrl',
      function ($scope, $http, $cookies, restServiceUrl) {
    
    $scope.login = function () {
    	var credentials = {username: $scope.username, password: $scope.password};
    	$http.post(restServiceUrl + 'login', credentials)
    		.success(function (result, status, headers, config) {
      			$scope.result = result;
   				$cookies['CSRF-TOKEN'] = headers('X-AUTH-TOKEN');
    		});
  }
}]);