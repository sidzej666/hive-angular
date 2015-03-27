'use strict';
 
angular.module('theHive')
  .controller('LoginCtrl', ['$scope', '$http', '$cookies', 'restServiceUrl', 'authorizationService',
      function ($scope, $http, $cookies, restServiceUrl, authorizationService) {
    $scope.invalidCredentials = false;
    $scope.passwordsDontMatch = false;

    $scope.login = function () {
    	var credentials = {username: $scope.username, password: $scope.password};
    	$http.post(restServiceUrl + '/login', credentials)
    		.success(function (result, status, headers, config) {
      		$scope.result = result;
   				$cookies['CSRF-TOKEN'] = headers('X-AUTH-TOKEN');
   				authorizationService.getRoles(headers('X-AUTH-TOKEN'));
          $scope.invalidCredentials = false;
    		})
        .error(function () {
          $scope.invalidCredentials = true;
        });
    };

    $scope.logout = function () {
      authorizationService.logout();
    };

    $scope.register = function (formData) {
      if ($scope.password != $scope.passwordConfirm) {
        $scope.passwordsDontMatch = true;
      }
    }
}]);