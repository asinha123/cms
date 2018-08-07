'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:GroupListingCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('GroupListingCtrl', ['$scope', '$route', 'messagePopupService', 'groupService', 'userService', 'utilService', function ($scope, $route, messagePopupService, groupService, userService, utilService) {
    var pagination = utilService.pagination();

    function groupListing() {

      var profile = userService.getLoggedInUser();

      pagination.options.userId = profile.userId;
      groupService.getGroupList(pagination.options)
        .then(function (response) {
          var data = [];
          if (response.data.result) {
            data = response.data.result.groupList;
            $scope.gridOptions.totalItems = response.data.result.count;
          }
          $scope.gridOptions.data = data;
        }, function (err) {
          messagePopupService.openGrowlError(err.statusText);
        });
    }

    $scope.confirmDelete = function (id) {
      var confirmPromise = messagePopupService.showConfirm('Do you want to delete?');
      confirmPromise.then(function () {
        groupService.deleteGroup(id)
          .then(function (result) {
            groupListing();
            messagePopupService.openGrowlSuccess(result.data.responseMessage);
          }, function (err) {
            messagePopupService.openGrowlError(err.data.responseMessage);
          });
      }, function () {
        return;
      });
    };

    $scope.confirmToggleStatus = function (id, status) {
      status = (status === 'active') ? 'inactive' : 'active';
      messagePopupService.showConfirm('Do you want status to be ' + status + '?')
        .then(function () {
          groupService.editGroup({ groupId: id, status: status })
            .then(function (result) {
              groupListing();
              messagePopupService.openGrowlSuccess(result.data.responseMessage);
            }, function (err) {
              messagePopupService.openGrowlError(err.data.responseMessage);
            });
        }, function () {
          return;
        });
    };

    $scope.search = function () {
      var options = angular.copy(pagination.options);
      options.searchText = $scope.searchText;
      groupService.getGroupList(options)
        .then(function (response) {
          var data = [];
          if (response.data.result) {
            data = response.data.result.groupList;
            $scope.gridOptions.totalItems = response.data.result.count;
          }
          $scope.gridOptions.data = data;
        }, function (err) {
          messagePopupService.openGrowlError(err.statusText);
        });
    }

    $scope.clearSearch = function () {
      $scope.searchText = '';
      groupListing();
    }


    function init() {
      $scope.gridOptions = {
        data: -1,
        paginationPageSizes: pagination.pageSizes,
        paginationPageSize: pagination.pageSize,
        columnDefs: [
          {
            name: 'groupId',
            headerCellClass: 'grid-align-right',
            cellClass: 'grid-align-right'
          },
          { name: 'groupName' },

          { name: 'status' },
          {
            name: 'action',
            cellTemplate: 'views/group/templates/groupAction.html',
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
              paginationOptions.sort = null;
            } else {
              paginationOptions.sort = sortColumns[0].sort.direction;
            }
            groupListing();
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            pagination.options.pageNumber = newPage;
            pagination.options.pageSize = pageSize;
            groupListing();
          });
        }
      };
      groupListing();
    }

    $scope.addEditGroup = function (groupId) {
      $route.updateParams({ groupId: groupId });
    };

    init();
  }]);
