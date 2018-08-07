'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:AddEditGroupCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddEditGroupCtrl', ['$scope', '$routeParams', '$http', 'messagePopupService', '$location', 'groupService', 'userService', function ($scope, $routeParams, $http, messagePopupService, $location, groupService, userService) {

    function init() {
      $scope.groupObj = {
        groupName: '',
        status: 'active',
        userId: userService.getLoggedInUser().userId
      };
      if ($routeParams.groupId && (_.isNumber(parseInt($routeParams.groupId)) || $routeParams.groupId === 'add')) {
        $scope.label = 'Add Group';
        $scope.mode = 'add';
        if ($routeParams.groupId !== 'add') {
          $scope.mode = 'edit';
          $scope.label = 'Edit Group';
          var promise = groupService.getGroup($routeParams.groupId);
          promise.then(function (response) {
            if (response.data.result) {
              delete response.data.result.password;
              $scope.groupObj = response.data.result;
            } else {
              $location.url('/group');
            }
          }, function (err) {
            $location.url('/group');
            messagePopupService.openGrowlError(err.statusText);
          });
        }
      } else {
        $location.url('/group');
      }
    }
    $scope.addEditGroup = function () {
      if ($routeParams.groupId === 'add') {
        groupService.addGroup($scope.groupObj)
        .then(function (response) {
          $location.url('/group');
          messagePopupService.openGrowlSuccess(response.data.responseMessage);
        }, function (err) {
          messagePopupService.openGrowlError(err.data.responseMessage);
        });
      } else {
        groupService.editGroup($scope.groupObj)
        .then(function (response) {
          $location.url('/group');
          messagePopupService.openGrowlSuccess(response.data.responseMessage);
        }, function (err) {
          messagePopupService.openGrowlError(err.data.responseMessage);
        });
      }
    };

    init();
  }]);
