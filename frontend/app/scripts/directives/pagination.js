'use strict';

/**
 * @ngdoc directive
 * @name fbPeekApp.directive:pagination
 * @description
 * # Directive for pagination/result navigation 
 */
angular.module('fbPeekApp')
  .directive('pagination', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'views/templates/result-nav.html'
    }
  });
