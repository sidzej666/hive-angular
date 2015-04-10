'use strict';
 
angular.module('theHive')
  .controller('LoginCtrl', ['$scope', '$http', 'restServiceUrl', 'authorizationService',
      function ($scope, $http, restServiceUrl, authorizationService) {
    $scope.invalidCredentials = false;

    $scope.login = function () {
    	var credentials = {username: $scope.username, password: $scope.password};
      authorizationService.login(credentials)
        .success(function () {
          $scope.invalidCredentials = false;
        })
        .error(function () {
          $scope.invalidCredentials = true;
        });
    };

    $scope.logout = function () {
      authorizationService.logout();
    };
}]);