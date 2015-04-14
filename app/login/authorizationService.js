angular.module('theHive')
  .service('authorizationService', ['$http', 'restServiceUrl', '$location', '$rootScope', '$cookies',
    function ($http, restServiceUrl, $location, $rootScope, $cookies) {
      this.userRoles = ['NOT_LOGGED'];
      this.userDataInitialized = false;
      $rootScope.userData = {};
      $rootScope.signedIn = false;

      this.userHasRole = function (role) {
        if (!this.userDataInitialized) {
          this.getUserData();
        }
        for (var j = 0; j < this.userRoles.length; j++) {
          if (role == this.userRoles[j]) {
            return true;
          }
        }
        return false;
      };

      this.authenticate = function (roles) {
        if (!this.userDataInitialized) {
          this.getUserData();
        }
        if (!this.userHasRole(roles)) {
          $location.path('/');
        }
      };

      this.getUserData = function (authToken) {
        if (authToken == undefined) {
          authToken = $cookies['CSRF-TOKEN'];
        }
        var request = {
          method: 'GET',
          url: restServiceUrl + '/users/me',
          headers: {'X-AUTH-TOKEN': authToken}
        };
        var self = this;
        $http(request)
        .success(function(data, status, headers, config) {
          self.userRoles = data.roles;
          self.userDataInitialized = true;
          $rootScope.signedIn = true;
          $rootScope.userData = data;
        })
        .error(function(data, status, headers, config) {
          self.userRoles = ['NOT_LOGGED'];
          $rootScope.signedIn = false;
          self.userDataInitialized = true;
        });
      };

      this.logout = function () {
        this.userRoles = ['NOT_LOGGED'];
        this.userDataInitialized = false;
        $rootScope.signedIn = false;
        $rootScope.userData = {};
        $cookies['CSRF-TOKEN'] = 'null';
      };

      this.login = function (credentials) {

        var self = this;
        var request = {
          method: 'POST',
          url: restServiceUrl + '/login',
          data: credentials
        }
        return $http(request)
                  .success(function (result, status, headers, config) {
                    self.setAuthCookieAndGetUserData(headers('X-AUTH-TOKEN'));
                  })
                  .error(function () {
                  });
      };

      this.register = function (userData) {
        var self = this;
        return $http.post(restServiceUrl + '/users', userData)
                  .success(function (result, status, headers, config) {
                    self.setAuthCookieAndGetUserData(headers('X-AUTH-TOKEN'));
                  });
      }

      this.setAuthCookieAndGetUserData = function (authToken) {
        $cookies['CSRF-TOKEN'] = authToken;
        this.getUserData(authToken);
      };
}]);