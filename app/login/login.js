'use strict';

angular.module('theHive')
  .controller('LoginCtrl', ['$scope', '$http', 'localStorageService', 
      function ($scope, $http, localStorage) {
    
    $scope.login = function () {
    	var credentials = {username: $scope.username, password: $scope.password};
    	$http.post('https://localhost:8444/HiveServer/rest/login', credentials)
    		.success(function (result) {
      			$scope.result = result;
    		});
  	};
  }]);