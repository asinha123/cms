'use strict';
angular.module('clientApp').directive('compareTo', function () {
  return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=compareTo'
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                if (scope.otherModelValue !== '') {
                return modelValue === scope.otherModelValue;
                }
                return true;
            };

            scope.$watch('otherModelValue', function() {
                ngModel.$validate();
            });
        }
    };
});
