var mainModule = angular.module('MyApp',['ngRoute','LocalStorageModule', 'ui.bootstrap']);

mainModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/selfservice/:deployGroup?', {
        templateUrl: 'app/build/templates/selfservice.tpl.html',
        controller: 'SelfServiceCtrl'
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
        redirectTo: '/selfservice'
      });
  }]);

mainModule.config(function (localStorageServiceProvider) {
  
});