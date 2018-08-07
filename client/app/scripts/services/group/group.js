'use strict';

/**
 * @ngdoc service
 * @name clientApp.groupService
 * @description
 * # user
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('groupService', ['$http', '$q', 'servicesUrl', 'commonApiService',
    function ($http, $q, servicesUrl, commonApiService) {

      function getGroupList(data) {
        return commonApiService.httpCall(servicesUrl.group.list, 'POST', data);

      }

      function getGroup(id) {
        return commonApiService.httpCall(servicesUrl.group.list + '/' + id, 'GET');
      }

      function addGroup(data) {
        return commonApiService.httpCall(servicesUrl.group.add, 'POST', data);
      }

      function editGroup(data) {
        return commonApiService.httpCall(servicesUrl.group.edit, 'PUT', data);
      }

      function deleteGroup(id) {
        return commonApiService.httpCall(servicesUrl.group.list + '/' + id, 'DELETE');
      }
      
      return ({
        getGroupList: getGroupList,
        getGroup: getGroup,
        addGroup: addGroup,
        editGroup: editGroup,
        deleteGroup: deleteGroup,
      });

    }

  ]);
