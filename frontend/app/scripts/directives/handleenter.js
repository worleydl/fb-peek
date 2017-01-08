'use strict';

/**
 * @ngdoc directive
 * @name fbPeekApp.directive:handleEnter
 * @description
 * # Detects enter keypress on any elements bound to
 */
angular.module('fbPeekApp')
  .directive('handleEnter', function () {
    return function(scope, element, attrs) {
      element.bind('keydown keypress', function(event) {
        if(event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.handleEnter);
          });

          event.preventDefault();
        }
      });
    }
  });
