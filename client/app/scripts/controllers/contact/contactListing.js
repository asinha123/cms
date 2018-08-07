'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:GroupListingCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ContactListingCtrl', ['$scope', '$route', '$routeParams', 'messagePopupService','groupService', 'contactService','utilService', function ($scope, $route, $routeParams, messagePopupService, groupService, contactService, utilService) {
    var pagination = utilService.pagination();

    function contactListing() {
      if ($routeParams.groupId && _.isNumber(parseInt($routeParams.groupId))) {
        pagination.options.groupId = parseInt($routeParams.groupId);
      }
      contactService.getContactList(pagination.options)
      .then(function (response) {
        var data = [];
        if (response.data.result) {
          data = response.data.result.contactList;
          _.each(data, function(contact) {
            contact.groupName = contact.group ? contact.group.groupName : null;
          });

          $scope.gridOptions.totalItems = response.data.result.count;
        }
        $scope.gridOptions.data = data;
      }, function (err) {
        messagePopupService.openGrowlError(err.statusText);
      });
    }

    $scope.confirmDelete = function (id) {
      messagePopupService.showConfirm('Do you want to delete?')
      .then(function () {
        contactService.deleteContact(id)
        .then(function (result) {
          contactListing();
          messagePopupService.openGrowlSuccess(result.data.responseMessage);
        },function(err) {
           messagePopupService.openGrowlError(err.data.responseMessage);
        });
      }, function() {
        return;
      });
    };

    $scope.confirmToggleStatus = function(id, status) {
      status = (status === 'active') ? 'inactive' : 'active';
      messagePopupService.showConfirm('Do you want status to be ' + status + '?')
      .then(function () {
        contactService.editContact({contactId: id, status: status})
        .then(function (result) {
          contactListing();
          messagePopupService.openGrowlSuccess(result.data.responseMessage);
        },function(err) {
           messagePopupService.openGrowlError(err.data.responseMessage);
        });
      }, function() {
        return;
      });
    };

    $scope.search = function() {
      var options = angular.copy(pagination.options);
      options.searchText = $scope.searchText;
      contactService.getContactList(options)
      .then(function (response) {
        var data = [];
        if (response.data.result) {
          data = response.data.result.contactList;
          $scope.gridOptions.totalItems = response.data.result.count;
        }
        $scope.gridOptions.data = data;
      }, function (err) {
        messagePopupService.openGrowlError(err.statusText);
      });
    };

    $scope.clearSearch = function() {
      $scope.searchText = '';
      contactListing();
    };


    function init() {

      if ($routeParams.groupId && _.isNumber(parseInt($routeParams.groupId))) {
        $scope.groupId = parseInt($routeParams.groupId);

        groupService.getGroup($routeParams.groupId)
          .then(function (response) {
            if (response.data.result) {
              $scope.groupName = response.data.result.groupName;
            } else {
              $scope.groupName = "Unknown group";
            }
          }, function (err) {
            messagePopupService.openGrowlError(err.statusText);
          });
      }

      $scope.gridOptions = {
        data: -1,
        paginationPageSizes: pagination.pageSizes,
        paginationPageSize: pagination.pageSize,
        columnDefs: [
          {
            name: 'contactId',
            headerCellClass: 'grid-align-right',
            cellClass: 'grid-align-right'
          },
          {name: 'groupName'},
          { name: 'fName', displayName: 'first name'},
          { name: 'lName', displayName: 'last name'},
          {name: 'email'},
          {name: 'phone'},
          { name: 'status'},
          {
            name: 'action',
            cellTemplate: 'views/contact/templates/contactAction.html',
            headerCellClass: 'grid-align-center',
            cellClass: 'grid-align-center',
            enableColumnMenu: false
          }
        ],
        useExternalPagination: true, ///for enabling server side 
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns.length === 0) {
              pagination.options.sort = null;
            } else {
              pagination.options.sort = sortColumns[0].sort.direction;
            }
            contactListing();
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            pagination.options.pageNumber = newPage;
            pagination.options.pageSize = pageSize;
            contactListing();
          });
        }
      };
      contactListing();
    }

    $scope.addEditCOntact = function (ContactId) {
      $route.updateParams({ ContactId: ContactId });
    };

    init();
  }]);
