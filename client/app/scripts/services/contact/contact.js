'use strict';

/**
 * @ngdoc service
 * @name clientApp.contactService
 * @description
 * # user
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('contactService', ['$http', '$q', 'servicesUrl', 'commonApiService',
    function ($http, $q, servicesUrl, commonApiService) {

      function getContactList(data) {
        return commonApiService.httpCall(servicesUrl.contact.list, 'POST', data);

      }

      function getContact(id) {
        return commonApiService.httpCall(servicesUrl.contact.list + '/' + id, 'GET');
      }

      function addContact(data) {
        return commonApiService.httpCall(servicesUrl.contact.add, 'POST', data);
      }

      function editContact(data) {
        return commonApiService.httpCall(servicesUrl.contact.edit, 'PUT', data);
      }

      function deleteContact(id) {
        return commonApiService.httpCall(servicesUrl.contact.list + '/' + id, 'DELETE');
      }

      return ({
        getContactList: getContactList,
        getContact: getContact,
        addContact: addContact,
        editContact: editContact,
        deleteContact: deleteContact
      });

    }

  ]);
