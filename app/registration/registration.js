'use strict';
 
angular.module('theHive')
  .controller('RegistrationCtrl', ['$scope', '$http', '$cookies', 'restServiceUrl', 'authorizationService',
      function ($scope, $http, $cookies, restServiceUrl, authorizationService) {
    $scope.passwordsDontMatch = false;
    $scope.registerButtonDisable = false;
    $scope.registerUserErrors = new Map();

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
        authorizationService.register(userData)
          .success(function () { })
          .error(function (errors) {
            if (errors.fieldErrors != undefined) {
              for (var i = 0; i < errors.fieldErrors.length; i++) {
                $scope.registerUserErrors.set(errors.fieldErrors[i].fieldName, errors.fieldErrors[i].message);
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