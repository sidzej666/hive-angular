'use strict';
 
angular.module('theHive')
  .controller('LoginCtrl', ['$scope', '$http', '$cookies', 'restServiceUrl', 'authorizationService',
      function ($scope, $http, $cookies, restServiceUrl, authorizationService) {
    $scope.invalidCredentials = false;
    $scope.passwordsDontMatch = false;
    $scope.registerButtonDisable = false;
    $scope.registerUserErrors = new Map();

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
      if ($scope.registerButtonDisable == true) {
        return;
      }
      $scope.registerButtonDisable = true;
      $scope.registerUserErrors = new Map();
      if (formData.$valid) {
        var userData = {
          username: $scope.username,
          password: $scope.password,
          email: $scope.email
        };
        $http.post(restServiceUrl + '/users', userData)
        .success(function (result, status, headers, config) {
          $cookies['CSRF-TOKEN'] = headers('X-AUTH-TOKEN');
          authorizationService.getRoles(headers('X-AUTH-TOKEN'));
        })
        .error(function (result, status, headers, config) {
          if (result.fieldErrors != undefined) {
            for (var i = 0; i < result.fieldErrors.length; i++) {
              $scope.registerUserErrors.set(result.fieldErrors[i].fieldName, result.fieldErrors[i].message);
            }
            formData.$submitted = true;
          }
        })
        .finally(function () {
          $scope.registerButtonDisable = false;
        });
      } else {
        $scope.registerButtonDisable = false;
      }
    }
}]);