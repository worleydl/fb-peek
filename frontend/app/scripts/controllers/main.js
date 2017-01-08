'use strict';

/**
 * @ngdoc function
 * @name fbPeekApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fbPeekApp
 */
angular.module('fbPeekApp')
  .controller('MainCtrl', ['$scope', '$filter', '$state', 'search', function ($scope, $filter, $state, search) {
    // Model variables
    $scope.dateFields = [];
    $scope.selectedDateField = $scope.dateFields.length > 0 ? $scope.dateFields[0].field : null;
    $scope.dtRange = {from: null, until: null};
    $scope.dtFilter = null;
    $scope.ftFormat = 'M.d.yyyy';

    $scope.facetCounts = [];
    $scope.facetFields = [
      {field: "content_type", display: "Type"},
    ];
    $scope.facetFilter = '';
    $scope.needFacets = true;

    $scope.sortOptions = [
      {field: false, display: "Relevance"},
      {field: 'date', display: "Date"},
    ];

    $scope.newQuery = true;
    $scope.mainSearchString = '';
    $scope.refineSearchString = '';
    $scope.refinementFilters = [];

    $scope.currentQuery = '';
    $scope.currentPage = 1;
    $scope.numFound = 0;
    $scope.unfilteredFound = 0;
    $scope.start = 0;
    $scope.resultSet = [];

    $scope.resultsPerPage = 10;

    // Triggered when paging changes
    $scope.pageChanged = function() {
      executeSearch();
    };

    $scope.getPageEnd = function() {
      return Math.min($scope.numFound, $scope.currentPage * $scope.resultsPerPage);
    };

    $scope.isFiltered = function() {
      return $scope.refinementFilters.length > 0 || $scope.dtFilter;
    };

    // Remove dt filter
    $scope.removeDt = function() {
      $scope.dtFilter = null;
      $scope.needFacets = true;
      executeSearch();
    };

    // Remove refinement filters
    $scope.removeRefine = function(filter) {
      $scope.refinementFilters.splice($scope.refinementFilters.indexOf(filter), 1);
      $scope.needFacets = true;
      executeSearch();
    };

    // Called when user clicks a facet option
    $scope.$on('facetChanged', function() {
      var facetFilters = [];

      angular.forEach($scope.facetCounts, function(counts, field) {
        angular.forEach(counts.counts, function(data, token) {
          if(data.selected) {
            facetFilters.push(field + ':"' + token + '"');
          }
        });
      });

      $scope.facetFilter = facetFilters.join(" OR ");
      executeSearch();
    });

    $scope.sortChanged = function() {
      executeSearch();
    };

    // Called when date fields are changed
    $scope.submitDate = function() {
      if($scope.dtRange.from !== null && $scope.dtRange.until !== null) {
        $scope.dtFilter = angular.copy($scope.dtRange);

        $scope.needFacets = true;
        executeSearch();
      }
    };

    // Called by refinement filter text input
    $scope.submitRefine = function() {
      if($scope.refineSearchString !== '' && $scope.refinementFilters.indexOf($scope.refineSearchString) === -1) {
        $scope.refinementFilters.push($scope.refineSearchString);
        $scope.refineSearchString = '';

        $scope.needFacets = true;
        executeSearch();
      };
    };

    // Called by main search form submission
    $scope.submitSearch = function() {
      $scope.currentPage = 1;
      $scope.currentQuery = $scope.mainSearchString;
      $scope.dtFilter = null;
      $scope.dtRange = {from: null, until: null};
      $scope.facetCounts = [];
      $scope.facetFilter = '';
      $scope.needFacets = true;
      $scope.newQuery = true;
      $scope.refinementFilters = [];
      $scope.resultSet = [];
      $scope.selectedSort = $scope.sortOptions[0];
      executeSearch();
    };

    // Query solr using the current form state
    function executeSearch() {
      var query = $scope.currentQuery;
      var params = {
        q: query,
        wt: 'json',
        rows: '10',
        start: ($scope.currentPage - 1) * $scope.resultsPerPage,
        fq: []
      };

      // Apply date filter 
      if($scope.dtFilter !== null) {
        var range = $scope.dtFilter.from.toISOString() +
            ' TO ' + $scope.dtFilter.until.toISOString();

        var rangeQuery = $scope.selectedDateField + ':[' + range + ']';
        params['fq'].push(rangeQuery);
      }

      // Apply refinement filters
      if($scope.refinementFilters.length > 0) {
        angular.forEach($scope.refinementFilters, function(filter) {
          params['fq'].push(filter);
        });
      }
      
      // Retrieve facet counts if this is a new query
      if($scope.needFacets) {
        // If we're reloading facets, clear existing filters
        $scope.facetFilter = '';

        params['facet'] = true;
        params['facet.field'] = $scope.facetFields.map(function(e){ return e.field; });
        params['facet.mincount'] = 1;
        params['json.nl'] = 'map';
      }

      // Apply facet filters
      if($scope.facetFilter !== '') {
        params['fq'].push($scope.facetFilter);
      }

      // Set sort
      if($scope.selectedSort.field) {
        params['sort'] = $scope.selectedSort.field + " asc";
      }
      
      search.query(params).then(function(response) {
        if(response.facet_counts !== undefined) {
          $scope.facetCounts = response.facet_counts.facet_fields;

          // Need to restructure data a bit for UI binding
          angular.forEach($scope.facetCounts, function(facet, field) {
            angular.forEach(facet, function(count, key) {
              facet[key] = {
                count: count,
                selected: false 
              };
            });

            $scope.facetCounts[field] = {
              display: $filter('filter')($scope.facetFields, {field: field}, true)[0].display,
              counts: facet
            };
          });
        }

        $scope.numFound = response.response.numFound;
        $scope.start = response.response.start;
        $scope.resultSet = response.response.docs;

        if($scope.newQuery) {
          $scope.unfilteredFound = $scope.numFound;
        }

        $scope.needFacets = false;
        $scope.newQuery = false;
        $scope.mainSearchString = '';
      }); 
    }

    $scope.getActive = function() {
      return $state.current.name === 'main';
    };
  }]);
