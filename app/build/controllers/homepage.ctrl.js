mainModule.controller('HomeCtrl', ['$scope', 'dashboardApiSrv', function ($scope, dashboardApiSrv) {

    var constants = {

    };

    var variables = {
        dashboard: {
            items: [{
                title: "Bamboo job",
                description: "Kicks off a bamboo job that deploys infra into Azure",
                logo: null,
                type: 'Bamboo',
                id: 'DP0-DBP0'
            }, {
                title: "Azure job",
                description: "Deployment via Azure API",
                logo: null,
                url: null
            },
            {
                title: "Another job",
                description: "Another infrastructure deployment",
                logo: null,
                url: null
            }]
        }
    };

    var functions = {
        deploy: function(type, id) {
            if(type) {
                dashboardApiSrv.deploy(type, id)
                    .success(function(data, status) {
                        toastr.success("Successfully requested build: "+data.buildNumber+" for plan: "+data.planKey);
                    })
                    .error(function(data, status) {
                        toastr.error("An error has occured");
                        console.log(data);
                    });
            }
            else {
                console.log("unknown type");
            }
        }
    };

    function setup() {
        $scope.constants = constants;
        $scope.variables = variables;
        $scope.functions = functions;
    }

    setup();
}]);