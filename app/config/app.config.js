var mainModule = angular.module('MyApp',['ngRoute']);

mainModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'app/templates/home.tpl.html',
        controller: 'HomeCtrl'
      }).
      when('/about', {
        templateUrl: 'app/templates/about-us.tpl.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);