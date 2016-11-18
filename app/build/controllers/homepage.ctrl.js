mainModule.controller('HomeCtrl', ['$scope', function ($scope) {

    var constants = {

    };

    var variables = {
        dashboard: {
            items: [{
                title: "Bamboo job",
                description: "Kicks off a bamboo job that deploys infra into Azure",
                logo: null
            }, {
                title: "Azure job",
                description: "Deployment via Azure API",
                logo: null
            },
            {
                title: "Another job",
                description: "Another infrastructure deployment",
                logo: null
            }]
        }
    };

    var functions = {

    };

    function setup() {
        $scope.constants = constants;
        $scope.variables = variables;
        $scope.functions = functions;
    }

    setup();
}]);