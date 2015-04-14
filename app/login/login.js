'use strict';
 
angular.module('theHive')
  .controller('LoginCtrl', ['$scope', 'authorizationService',
      function ($scope, authorizationService) {
    $scope.invalidCredentials = false;

    $scope.login = function () {
    	var credentials = {username: $scope.username, password: $scope.password};
      authorizationService.login(credentials)
        .success(function () {
          console.log('in success')
          $scope.invalidCredentials = false;
        })
        .error(function () {
          console.log('in error 222')
          $scope.invalidCredentials = true;
        });
    };

    $scope.logout = function () {
      authorizationService.logout();
    };
}]);