'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:AddEditContactCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddEditContactCtrl', ['$scope', '$routeParams', '$http', 'messagePopupService', '$location', 'contactService', 'groupService', function ($scope, $routeParams, $http, messagePopupService, $location, contactService, groupService) {

    function init() {
      if (($routeParams.contactId && (_.isNumber(parseInt($routeParams.contactId)) || $routeParams.contactId === 'add')) && ($routeParams.groupId && parseInt($routeParams.groupId) && (_.isNumber(parseInt($routeParams.groupId))))) {
        $scope.label = 'Add Contact';
        $scope.mode = 'add';

        $scope.contactObj = {
          fName: '',
          lName: '',
          email: '',
          phone: '',
          status: 'active',
          groupId: $routeParams.groupId
        };

        groupService.getGroup($routeParams.groupId)
          .then(function (response) {
            if (response.data.result) {
              $scope.groupName = response.data.result.groupName;
            } else {
              $scope.groupName = "Unknown group";
            }
          }, function (err) {
            $location.url('/contact');
            messagePopupService.openGrowlError(err.statusText);
          });

        if ($routeParams.contactId !== 'add') {
          $scope.mode = 'edit';
          $scope.label = 'Edit Contact';
          var promise = contactService.getContact($routeParams.contactId);
          promise.then(function (response) {
            if (response.data.result) {
              delete response.data.result.password;
              $scope.contactObj = response.data.result;
            } else {
              $location.url('/contact');
            }
          }, function (err) {
            $location.url('/contact');
            messagePopupService.openGrowlError(err.statusText);
          });
        }
      } else {
        $routeParams = {};
        $location.url('/contact');
      }
    }
    $scope.addEditContact = function () {
      if ($routeParams.contactId === 'add') {
        contactService.addContact($scope.contactObj)
          .then(function (response) {
            if ($routeParams.groupId && _.isNumber(parseInt($routeParams.groupId))) {
              $location.url('/contact?groupId='+ parseInt($routeParams.groupId));
            } else {
              $location.url('/contact');
            }
            messagePopupService.openGrowlSuccess(response.data.responseMessage);
          }, function (err) {
            messagePopupService.openGrowlError(err.data.responseMessage);
          });
      } else {
        contactService.editContact($scope.contactObj)
          .then(function (response) {
            if ($routeParams.groupId && _.isNumber(parseInt($routeParams.groupId))) {
              $location.url('/contact?groupId='+ parseInt($routeParams.groupId));
            } else {
              $location.url('/contact');
            }
            messagePopupService.openGrowlSuccess(response.data.responseMessage);
          }, function (err) {
            messagePopupService.openGrowlError(err.data.responseMessage);
          });
      }
    };

    init();
  }]);
