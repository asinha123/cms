'use strict';

angular.module('clientApp')
  .factory('commonApiService', ['$http', '$q', function ($http, $q) {
    function httpCall(url, method, data) {
      data = (data !== undefined) ? data : {};
      var deferObj = $q.defer();
      $http({
        method: method,
        url: url,
        data: data
      }).then(function success(response) {
        deferObj.resolve(response);
      }, function error(response) {
        deferObj.reject(response);
      });
      return deferObj.promise;
    }
    return {
      httpCall: httpCall
    };
  }]);
