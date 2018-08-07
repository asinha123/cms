'use strict';
/**
 * @ngdoc function
 * @name clientApp.controller:UserListingCtrl
 * @description
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserListingCtrl', ['$scope', '$route', 'messagePopupService', 'userService','utilService', function ($scope, $route, messagePopupService, userService, utilService) {
    var pagination = utilService.pagination();

    function userListing() {
      $scope.label = 'User Listing';
      var promise = userService.getUserList(pagination.options);
      promise.then(function (response) {
        var data = [];
        if (response.data.result) {
          data = response.data.result.userList;
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
        var promise = userService.deleteUser(id);
        promise.then(function () {
          userListing();
        },function(err) {
           messagePopupService.openGrowlError(err.data.responseMessage);
        });
      });
    };

    function init() {
      $scope.gridOptions = {
        data: -1,
        paginationPageSizes: pagination.pageSizes,
        paginationPageSize: pagination.pageSize,
        columnDefs: [
          {
            name: 'userId',
            headerCellClass: 'grid-align-right',
            cellClass: 'grid-align-right'
          },
          { name: 'userName'},
          { name: 'fName', displayName: 'first name'},
          { name: 'lName' , displayName: 'last name'},
          { name: 'email' },
          { name: 'phone' },
          {
            name: 'action',
            cellTemplate: 'views/user/templates/userAction.html',
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
            userListing();
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;
            userListing();
          });
        }
      };
      userListing();
    }

    $scope.addEditUser = function (userId) {
      $route.updateParams({ userId: userId });
    };

    init();
  }]);
