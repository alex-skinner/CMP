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
mainModule.controller('HomeCtrl',['$scope', function($scope){
    var constants = {
      alert: alert ,
      url:'/api/something'
    };
    
    var variables = {
        name:"Runi"
    };
    
    var functions = {
        alertName: function(){
            constants.alert(variables.name);
        }  
    };
    
    $scope.variables = variables;
    $scope.functions = functions;
}]);