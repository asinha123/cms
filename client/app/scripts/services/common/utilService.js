'use strict';

angular.module('clientApp')
  .factory('utilService', [function () {

    var pagination = function() {
      return {
        options: {
          pageNumber: 1,
          pageSize: 10,
          sort: 'updatedAt',
          order: 'DESC'
        },
        pageSizes: [10, 20, 50]
      };
    };
    return {
      pagination: pagination,
    };
  }
]);
