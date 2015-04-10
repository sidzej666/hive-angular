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
        $http(request)
        .success(function(data, status, headers, config) {
          this.userRoles = data.roles;
          this.userDataInitialized = true;
          $rootScope.signedIn = true;
          $rootScope.userData = data;
        })
        .error(function(data, status, headers, config) {
          this.userRoles = ['NOT_LOGGED'];
          $rootScope.signedIn = false;
          this.userDataInitialized = true;
        });
      };

      this.logout = function () {
        this.userRoles = ['NOT_LOGGED'];
        this.userDataInitialized = false;
        $rootScope.signedIn = false;
        $cookies['CSRF-TOKEN'] = 'null';
      };

      this.login = function (credentials) {
        var self = this;
        return $http.post(restServiceUrl + '/login', credentials)
                  .success(function (result, status, headers, config) {
                    self.setAuthCookieAndGetUserData(headers);
                  })
                  .error(function () {
                  });
      };

      this.register = function (userData) {
        var self = this;
        return $http.post(restServiceUrl + '/users', userData)
                  .success(function (result, status, headers, config) {
                    self.setAuthCookieAndGetUserData(headers);
                  });
      }

      this.setAuthCookieAndGetUserData = function (headers) {
        $cookies['CSRF-TOKEN'] = headers('X-AUTH-TOKEN');
        this.getUserData(headers('X-AUTH-TOKEN'));
      };
}]);