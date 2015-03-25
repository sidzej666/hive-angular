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
    'ngTouch'
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
        controller: 'GamesCtrl',
        resolve: {
            permission: function(authorizationService) {
              return authorizationService.authenticate(['USER']);
            },
        }
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
    var $cookies;
    angular.injector(['ngCookies']).invoke(function(_$cookies_) {
      $cookies = _$cookies_;
    });

    //fancy random token, losely after https://gist.github.com/jed/982883
    function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e16]+1e16).replace(/[01]/g,b)};
    // delete header from client:
    // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(function($q) {
      return {
          'request': function(config) {
              // put a new random secret into our CSRF-TOKEN Cookie before each request
              //var cookie = b();
              //document.cookie = 'CSRF-TOKEN=' + cookie;
              if ($cookies['CSRF-TOKEN'] != 'null') {
                config.headers['X-AUTH-TOKEN'] = $cookies['CSRF-TOKEN'];
              }
              return config;
          },
          'responseError': function(error) {
            if (error.status == 401 || error.status == 403) {
              $cookies['CSRF-TOKEN'] = 'null';
            }
            return $q.reject(error);
          }
      };
    });
  }])
  .value('restServiceUrl', 'https://localhost:8444/HiveServer/rest');
