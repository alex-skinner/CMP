var mainModule = angular.module('MyApp',['ngRoute','LocalStorageModule', 'ui.bootstrap']);

mainModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'app/build/templates/home.tpl.html',
        controller: 'HomeCtrl'
      }).
      when('/about', {
        templateUrl: 'app/build/templates/about-us.tpl.html',
        controller: 'AboutCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

mainModule.config(function (localStorageServiceProvider) {
});