'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:GroupCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('GroupCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.tab = 'listing';
    if ($routeParams.groupId) {
      $scope.tab = 'addEdit';
    }
  }]);
