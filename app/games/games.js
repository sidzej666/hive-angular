'use strict';

angular.module('theHive')
  .controller('GamesCtrl', ['$scope', 'gamesService', function ($scope, gamesService) {
    var game = {title : "Kaman zioms!",
  				description : "sidzej wbijaj!"};
    $scope.showGames = true;
    $scope.games = gamesService.getGames();
    /*
    if ($scope.games.length > 0) {
    	$scope.showGames = true;
    } else {
    	$scope.showGames = false;
    }
    */
  }]); 
