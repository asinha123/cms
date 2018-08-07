'use strict';

/**
 * @ngdoc service
 * @name clientApp.userService
 * @description
 * # user
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('userService', ['$http', 'servicesUrl', 'commonApiService',
    function ($http, servicesUrl, commonApiService) {

      function getUserStatus() {
        return commonApiService.httpCall(servicesUrl.user.validate, 'GET');
      }

      function login(userObj) {
        return commonApiService.httpCall(servicesUrl.user.login, 'POST', { email: userObj.email, password: userObj.password });
      }


      function register(data) {
        return commonApiService.httpCall(servicesUrl.user.register, 'POST', data);
      }



      function getUserList(data) {
        return commonApiService.httpCall(servicesUrl.user.list, 'POST', data);

      }

      function getUser(id) {
        return commonApiService.httpCall(servicesUrl.user.list + '/' + id, 'GET');
      }

      function editUser(data) {
        return commonApiService.httpCall(servicesUrl.user.edit, 'PUT', data);
      }




      function url_base64_decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
          case 0:
            break;
          case 2:
            output += '==';
            break;
          case 3:
            output += '=';
            break;
          default:
            throw 'Illegal base64url string!';
        }
        return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
      }

      function getLoggedInUser() {
        if ($http.defaults.headers.common.Authorization) {
          var encodedProfile = $http.defaults.headers.common.Authorization.split('.')[1];
          return JSON.parse(url_base64_decode(encodedProfile));
        } else {
          return;
        }
      }

      function changePassword(data) {
        return commonApiService.httpCall(servicesUrl.user.changePassword, 'PUT', data);
      }
      return ({
        getUserList: getUserList,
        getUser: getUser,
        getUserStatus: getUserStatus,
        login: login,
        register: register,
        getLoggedInUser: getLoggedInUser,
        editUser: editUser,
        changePassword: changePassword
      });

    }

  ]);
