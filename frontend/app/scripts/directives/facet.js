'use strict';

/**
 * @ngdoc directive
 * @name fbPeekApp.directive:facet
 * @description
 * # facet
 */
angular.module('fbPeekApp')
  .directive('facet', function () {
    return {
      templateUrl: 'views/templates/facet.html',
      restrict: 'E',
      scope: {
        facetCounts: '=',
        facetName: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.selectAll = true;
        
        // Are any filters selected?
        function checkFilters() {
          return Object.keys(scope.facetCounts).find(findSelected) ? true : false;
        }

        // Utility function used by checkFilters to find selected items
        function findSelected(e) {
          return scope.facetCounts[e].selected;
        }
                        
        // Called when facet options are clicked (The ALL option is excluded)
        scope.facetChanged = function() {
          scope.selectAll = !checkFilters();

          // Let app know facets have been modified
          scope.$emit('facetChanged');
        };

        // Called when select all is changed
        scope.selectAllChanged = function() {
          // Clear facet selections on select all
          if(scope.selectAll) {
            angular.forEach(scope.facetCounts, function(facet) {
              facet.selected = false;
            });
          // Can't turn off select all if no filters are selected
          } else if(!checkFilters()) {
            scope.selectAll = true;

            // Return to prevent emitting event, nothing changed
            return;
          }

          scope.$emit('facetChanged');
        };

        // Change of facet data means selectAll goes back to true
        scope.$watch('facetCounts', function() {
          scope.selectAll = true;
        });
      }
    };
  });
