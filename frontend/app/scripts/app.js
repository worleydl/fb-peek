'use strict';

/**
 * @ngdoc overview
 * @name fbPeekApp
 * @description
 *
 * Main module of the application.
 */
angular
  .module('fbPeekApp', [
    'cfg',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      });
  }]);
