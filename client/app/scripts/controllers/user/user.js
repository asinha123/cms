'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', ['$scope', '$routeParams', 'userService', '$location', 'messagePopupService', function ($scope, $routeParams, userService, $location, messagePopupService) {

    function init() {
      var profile = userService.getLoggedInUser();
      userService.getUser(profile.userId)
        .then(function (response) {
          $scope.userObj = response.data.result;
        }, function (err) {
          $location.url('/');
          messagePopupService.openGrowlError(err.statusText);
        });

      $scope.passObj = {};
    }

    $scope.editProfile = function () {
      userService.editUser($scope.userObj)
        .then(function (response) {
          messagePopupService.openGrowlSuccess(response.data.responseMessage);
        }, function (err) {
          messagePopupService.openGrowlError(err.data.responseMessage);
        });
    };
    $scope.matchOldAndNewPassword = function () {
      $scope.changePasswordForm.newPassword.$setValidity('matchOldNew', $scope.passObj.newPassword !== $scope.passObj.oldPassword);
    };
    $scope.changePassword = function () {
      var profile = userService.getLoggedInUser();
      $scope.passObj.userId = profile.userId;
      userService.changePassword($scope.passObj)
        .then(function (response) {
          messagePopupService.openGrowlSuccess(response.data.responseMessage);
        }, function (err) {
          messagePopupService.openGrowlError(err.data.responseMessage);
        });
    };

    init();

  }]);
