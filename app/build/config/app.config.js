var mainModule = angular.module('MyApp',['ngRoute','LocalStorageModule', 'ui.bootstrap']);

mainModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'app/build/templates/home.tpl.html',
        controller: 'HomeCtrl'
      }).
      when('/resourcegroups', {
        templateUrl: 'app/build/templates/resource-groups.tpl.html',
        controller: 'ResourceGroups'
      }).
      when('/resourcegroup/:Name', {
        templateUrl: 'app/build/templates/resource-group.tpl.html',
        controller: 'ResourceGroup'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

mainModule.config(function (localStorageServiceProvider) {
});