'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:ContactCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ContactCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.tab = 'listing';
    if ($routeParams.contactId) {
      $scope.tab = 'addEdit';
    }
  }]);
