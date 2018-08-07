'use strict';

angular.module('clientApp')
  .factory('config', [function () {
    var domain = "inmar.com";
    return {
      domain: domain
    };
  }]);