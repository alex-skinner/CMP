mainModule.controller('ResourceGroup', ['$scope', '$routeParams', 'dashboardApiSrv', function($scope, $routeParams, dashboardApiSrv){

    var constants = {

    };

    var variables = {
        rgName: null,
        resourceGroup: null
    };

    var functions = {
        getResourceGroup: function() {
            if (variables.rgName) {
                dashboardApiSrv.getResourceGroup(variables.rgName)
                    .success(function (data, status) {
                        variables.resourceGroup = angular.copy(data.value);
                        toastr.success("Successfully retrieved the resource group");
                    })
                    .error(function (data, status) {
                        toastr.error("Could not retrieve the resource group");
                    });
            }
            else {
                toastr.error("Invalid name for resource group:", variables.rgName);
            }
        }
    };

    function setup(){
        $scope.constants = constants;
        $scope.variables = variables;
        $scope.functions = functions;

        variables.rgName = $routeParams.Name;

        functions.getResourceGroup();
        
    }

    setup();
}]);