angular.module('theHive')
  .service('authorizationService', ['$http', 'restServiceUrl', '$location',
    function ($http, restServiceUrl, $location) {
      var userRoles = [];
      var rolesInitialized = false;
      this.userHasRole = function (role) {
        for (var j = 0; j < userRoles.length; j++) {
          if (role == userRoles[j]) {
            return true;
          }
        }
        return false;
      };

      this.authenticate = function (roles) {
        if (!rolesInitialized) {
          this.getRoles();
        }
        if (!this.userHasRole(roles)) {
          $location.path('/');
        }
      };

      this.getRoles = function () {
        $http.get(restServiceUrl + '/users/me')
        .success(function(data, status, headers, config) {
          userRoles = data.roles;
          rolesInitialized = true;
        })
        .error(function(data, status, headers, config) {
          userRoles = [];
        });
      }
}]);