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
    'ab-base64'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'games/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'games/about.html',
        controller: 'AboutCtrl'
      })
      .when('/games', {
        templateUrl: 'games/games.html',
        controller: 'GamesCtrl'
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
    //$httpProvider.defaults.headers.common['X-CSRFToken'] = 'aaaa';

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
  }]);
