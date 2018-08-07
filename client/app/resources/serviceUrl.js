'use strict';

angular.module('clientApp')
  .factory('servicesUrl', [function () {

    var authServicePath = '/api/auth/';
    var servicePath = '/api/';
    var resources = '/resources/';
    var noAuth = '/new'

    var servicesUrl = {
      user: {
        login: authServicePath + 'user/login',
        validate: authServicePath + 'user/checkAuth',
        list: authServicePath + 'user/list',
        add: authServicePath + 'user/add',
        edit: authServicePath + 'user/edit',
        register: servicePath + 'user/register',
        changePassword: authServicePath + 'user/changePassword'
      },

      group: {
        list: authServicePath + 'group/list',
        add: authServicePath + 'group/add',
        edit: authServicePath + 'group/edit'
      },

      contact: {
        list: authServicePath + 'contact/list',
        add: authServicePath + 'contact/add',
        edit: authServicePath + 'contact/edit'
      }
    };
    return servicesUrl;
  }]);
