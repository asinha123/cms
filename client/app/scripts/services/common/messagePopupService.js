'use strict';

angular.module('clientApp')
  .factory('messagePopupService', ['servicesUrl', '$http', '$q', 'growl', '$mdDialog', function (servicesUrl, $http, $q, growl, $mdDialog) {
    var notificationTimeout = 5000;


    function getNotificationTimeout() {
      var d = $q.defer();
      if (notificationTimeout === false) {
        $http.get(servicesUrl.settingsUrl)
          .then(function success(response) {
            notificationTimeout = response.notificationTimeout;
            d.resolve(notificationTimeout);
          }, function error(response) {
            console.log('Unable to fetch ' + servicesUrl.settingsUrl);
            d.resolve(-1);
          });
      }
      else {
        d.resolve(notificationTimeout);
      }
      return d.promise;
    }

    return {
      openGrowl: function (type, messageText, conf) {
        getNotificationTimeout().then(function (ttl) {
          if (!angular.isObject(conf)) {
            conf = { ttl: ttl };
          }
          else if (!angular.isNumber(conf.ttl)) {
            conf.ttl = { ttl: ttl };
          }

          if (type === 'success') {
            growl.success(messageText, conf);
          }
          else if (type === 'error') {
            growl.error(messageText, conf);
          }
          else if (type === 'warning') {
            growl.warning(messageText, conf);
          }
          else {// type = 'info'
            growl.info(messageText, conf);
          }
        });
      },
      openGrowlSuccess: function (messageText, conf) {
        this.openGrowl('success', messageText, conf);
      },
      openGrowlError: function (messageText, conf) {
        this.openGrowl('error', messageText, conf);
      },
      openGrowlWarning: function (messageText, conf) {
        this.openGrowl('warning', messageText, conf);
      },
      openGrowlInfo: function (messageText, conf) {
        this.openGrowl('info', messageText, conf);
      },
      showConfirm: function (message, ev) {
        message = message ? message : '';
        var confirm = $mdDialog.confirm({
          controller: 'DialogController',
          templateUrl: 'views/popup/confirmDialog.html',
          clickOutsideToClose: true,
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            message: message
          }
        });
        return $mdDialog.show(confirm);
      },
      passwordPrompt: function (message, ev) {
        message = message ? message : '';
        var confirm = $mdDialog.confirm({
          controller: 'DialogController',
          templateUrl: 'views/popup/passwordDialog.html',
          clickOutsideToClose: true,
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            message: message
          }
        });
        return $mdDialog.show(confirm);
      }
    };


  }]);

angular.module('clientApp')
  .controller('DialogController', ['$scope', '$mdDialog', 'message', function ($scope, $mdDialog, message) {
    
    $scope.message = message;
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.submitPassword = function() {
       $mdDialog.hide($scope.password);
    };

  }]);
