'use strict';

/**
 * @ngdoc service
 * @name fbPeekApp.search
 * @description
 * # search
 * Service in the fbPeekApp.
 */
angular.module('fbPeekApp')
  .service('search', ['$http', '$log', '$q', 'SOLR_HOST', function ($http, $log, $q, SOLR_HOST) {
    var factory = {};

    var SOLR_URL = 'http://' + SOLR_HOST + ':8983/solr/documents/select?';

    factory.query = function(params) {
      $log.info('Searching for: ' + params.q);

      var deferred = $q.defer();

      var auth = $base64.encode(SOLR_USER + ':' + SOLR_PASS);

      $http({
        method: 'GET',
        params: params,
        url: SOLR_URL
      }).then(function success(response) {
        deferred.resolve(response.data);
      }, function error(response) {
        deferred.reject();
      });

      return deferred.promise;
    };

    return factory;
  }]);
