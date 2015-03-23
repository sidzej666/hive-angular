'use strict';

/**
 * @ngdoc overview
 * @name angularTestApp
 * @description
 * # angularTestApp
 *
 * Main module of the application.
 */
angular
  .module('theHive', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ab-base64',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
      })
      .when('/about', {
        templateUrl: 'games/about.html',
        controller: 'AboutCtrl'
      })
      .when('/games', {
        templateUrl: 'games/games.html',
        controller: 'GamesCtrl'
      })
      .when('/signup', {
        templateUrl: 'login/signup.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$httpProvider', function ($httpProvider) {
    //fancy random token, losely after https://gist.github.com/jed/982883
    function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e16]+1e16).replace(/[01]/g,b)};
    // delete header from client:
    // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(function() {
      return {
          'request': function(config) {
              // put a new random secret into our CSRF-TOKEN Cookie before each request
              var cookie = b();
              document.cookie = 'CSRF-TOKEN=' + cookie;
              config.headers['X-CSRF-TOKEN'] = cookie;
              return config;
          }
      };
    })
  }])
  .factory('Auth', function($http, LocalService, AccessLevels) {
  return {
    authorize: function(access) {
      if (access === AccessLevels.user) {
        return this.isAuthenticated();
      } else {
        return true;
      }
    },
    isAuthenticated: function() {
      return LocalService.get('auth_token');
    },
    login: function(credentials) {
      var login = $http.post('https://localhost:8444/HiveServer/rest/login', credentials);
      login.success(function(result) {
        LocalService.set('auth_token', JSON.stringify(result));
      });
      return login;
    },
    logout: function() {
      // The backend doesn't care about logouts, delete the token and you're good to go.
      LocalService.unset('auth_token');
    },
    register: function(formData) {
      LocalService.unset('auth_token');
      var register = $http.post('/auth/register', formData);
      register.success(function(result) {
        LocalService.set('auth_token', JSON.stringify(result));
      });
      return register;
    }
  };
});
