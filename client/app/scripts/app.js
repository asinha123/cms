'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngMessages',
    'angular-growl',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ngMdIcons',
    'ngCookies'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/user', {
        templateUrl: 'views/user/user.html',
        controller: 'UserCtrl'
      })
      .when('/group', {
        templateUrl: 'views/group/group.html',
        controller: 'GroupCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'LoginCtrl'
      })
      .when('/edit-profile', {
        templateUrl: 'views/user/profile.html',
        controller: 'UserCtrl'
      })
      .when('/change-password', {
        templateUrl: 'views/user/changePassword.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  .config(['growlProvider', function (growlProvider) {
    growlProvider.globalDisableCountDown(true);
  }]);
