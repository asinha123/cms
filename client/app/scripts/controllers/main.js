'use strict';

/**  * @ngdoc function  
 *  @name clientApp.controller:MainCtrl  
 *  @description * # MainCtrl  * Controller of the clientApp
 * 
*/ angular.module('clientApp').controller('MainCtrl', ['$scope', 'userService', 'contactService', 'messagePopupService', function ($scope, userService, contactService, messagePopupService) {

  function init() {
    $scope.profile = userService.getLoggedInUser();
    var options = {};
    if ($scope.profile) {
      options.userId = $scope.profile.userId;
      contactService.getContactList(options)
        .then(function (response) {
          var data = [];
          if (response.data.result) {
            data = response.data.result.contactList;
            _.each(data, function (contact) {
              contact.groupName = contact.group ? contact.group.groupName : null;
            });
          }
        }, function (err) {
          messagePopupService.openGrowlError(err.statusText);
        });
    }


  }

  init();
}]);
