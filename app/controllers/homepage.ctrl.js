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