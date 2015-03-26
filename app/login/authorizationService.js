angular.module('theHive')
  .service('authorizationService', ['$http', 'restServiceUrl', '$location', '$rootScope', '$cookies',
    function ($http, restServiceUrl, $location, $rootScope, $cookies) {
      var userRoles = ['NOT_LOGGED'];
      var rolesInitialized = false;
      $rootScope.signedIn = false;

      this.userHasRole = function (role) {
        if (!rolesInitialized) {
          this.getRoles();
        }
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

      this.getRoles = function (authToken) {
        if (authToken == undefined) {
          authToken = $cookies['CSRF-TOKEN'];
        }
        var request = {
          method: 'GET',
          url: restServiceUrl + '/users/me',
          headers: {'X-AUTH-TOKEN': authToken}
        };
        $http(request)
        .success(function(data, status, headers, config) {
          userRoles = data.roles;
          rolesInitialized = true;
          $rootScope.signedIn = true;
        })
        .error(function(data, status, headers, config) {
          userRoles = ['NOT_LOGGED'];
          $rootScope.signedIn = false;
        });
      };

      this.logout = function () {
        userRoles = ['NOT_LOGGED'];
        rolesInitialized = false;
        $rootScope.signedIn = false;
        $cookies['CSRF-TOKEN'] = 'null';
      };
}]);