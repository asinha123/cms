'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */

angular.module('clientApp')
  .controller('LoginCtrl', ['$scope', '$location', 'userService', '$window', '$rootScope', '$http', 'servicesUrl', 'config', 'messagePopupService', function ($scope, $location, userService, $window, $rootScope, $http, servicesUrl, config, messagePopupService) {

    function int() {
      $scope.loginObj = {};
      $scope.loginObj.template = {
        login: {
          name: 'Login',
          url: 'views/login.html'
        },
        page: {
          name: 'Page',
          url: 'views/page.html'
        },
        register: {
          name: 'register',
          url: 'views/register.html'
        }
      };

      $scope.userObj = {};

      $scope.emailPattern = new RegExp("^[A-Za-z0-9._%+-]+@" + config.domain + "$");
    }

    $scope.login = function () {
      userService.login($scope.userObj)
        .then(function (response) {
          if (response.data.token) {
            $rootScope.activeTemp = $scope.loginObj.template.page;
            $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

            $window.localStorage.Authorization = 'Bearer ' + response.data.token;
            $scope.isAuthenticated = true;
            $location.path('/');
            messagePopupService.openGrowlSuccess('Welcome to CMS...');
          }
          else {
            $rootScope.activeTemp = $scope.loginObj.template.login;
            $scope.loginObj.errorMsg = response.data.result;
          }
        }, function (response) {
          $rootScope.activeTemp = $scope.loginObj.template.login;
          $scope.loginObj.errorMsg = response.data.result;
        });
    };

    $scope.register = function () {
      delete $scope.userObj.confirmPassword;
      userService.register($scope.userObj)
        .then(function (response) {
          messagePopupService.openGrowlSuccess(response.data.responseMessage);
        }, function (err) {
          messagePopupService.openGrowlError(err.data.responseMessage);
        });
      };

    $rootScope.$on('$routeChangeStart',
      function () {
        if (!$http.defaults.headers.common.Authorization) {
          $http.defaults.headers.common.Authorization = $window.localStorage.Authorization;
          if ($location.path() === '/register') {
            $rootScope.activeTemp = $scope.loginObj.template.register;
            $location.path('/register');
            return;
          }
          userService.getUserStatus()
            .then(function () {
              $rootScope.activeTemp = $scope.loginObj.template.page;
            }, function () {
              $rootScope.activeTemp = $scope.loginObj.template.login;
              $scope.userObj.email = '';
              $scope.userObj.password = '';
              $location.path('/login');
            });
        }
        else {
          $rootScope.activeTemp = $scope.loginObj.template.page;
          if ($location.path() === '/login') {
            $location.path('/');
          }
        }
      });

    int();

  }]);

angular.module('clientApp')
  .controller('LogoutCtrl', ['$scope', '$location', '$http', '$window', function ($scope, $location, $http, $window) {

    $scope.logout = function () {
      $http.defaults.headers.common.Authorization = '';
      $window.localStorage.clear();
      $location.path('/login');
    };

  }]);

