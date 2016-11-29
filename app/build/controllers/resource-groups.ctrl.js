mainModule.controller('ResourceGroups', ['$scope', '$location', 'dashboardApiSrv', function ($scope, $location, dashboardApiSrv) {

    var constants = {

    };

    var variables = {
        resourceGroups: null
    };

    var functions = {
        getResourceGroups: function () {
            dashboardApiSrv.getResourceGroups()
                .success(function (data, status) {
                    variables.resourceGroups = angular.copy(data.value);
                    toastr.success("Successfully retrieved the Resource Groups");
                })
                .error(function (data, status) {
                    toastr.error("An error occured");
                });
        },
        showResourceGroup: function(name) {
            $location.path('/resourcegroup/'+name);
        }
    };

    function setup() {
        $scope.constants = constants;
        $scope.variables = variables;
        $scope.functions = functions;

        functions.getResourceGroups();
    }

    setup();
}]);