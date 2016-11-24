mainModule.controller('SelfServiceCtrl', ['$scope', '$routeParams', 'dashboardApiSrv', function ($scope, $routeParams, dashboardApiSrv) {

    var constants = {
        infraItems: [{
            name: "Bamboo job",
            description: "Kicks off a bamboo job that deploys infra into Azure",
            logo: null,
            type: 'bamboo',
            id: 'DP0-DBP0'
        }, {
            name: "Azure job",
            description: "Deployment via Azure API",
            logo: null,
            url: null
        }, {
            name: "Another job",
            description: "Another infrastructure deployment",
            logo: null,
            url: null
        }],
        vmItems: [{
            name: "Windows Server 2012 R2",
            description: "Deploys a Windows Server 2012 R2 machine",
            logo: null,
            type: 'windows'
        }, {
            name: "Windows Server 2016",
            description: "Deploys a Windows Server 2016 machine",
            logo: null,
            type: 'windows'
        }]
    };

    var variables = {
        display: null,
        dashboard: {
            items: null
        },
        deploymentItem: null
    };

    var functions = {
        deploy: function (type, id) {
            if (type) {
                dashboardApiSrv.deploy(type, id)
                    .success(function (data, status) {
                        toastr.success("Successfully requested build: " + data.buildNumber + " for plan: " + data.planKey);
                    })
                    .error(function (data, status) {
                        toastr.error("An error has occured");
                        console.log(data);
                    });
            } else {
                console.log("unknown type");
            }
        },
        openModal: function (item) {
            variables.deploymentItem = item;
            $('#deployModal').modal('show');
        },
        checkDisplay: function () {
            variables.display = $routeParams.deployGroup;
            if (variables.display === 'vms') {
                variables.dashboard.items = angular.copy(constants.vmItems);
            } else if (variables.display === 'inf') {
                variables.dashboard.items = angular.copy(constants.infraItems);
            } else {
                variables.display = null;
            }
        },
        registerEventListeners: function() {
            $('#deployModal').on('hidden.bs.modal', function() {
                variables.deploymentItem = null;
            });
        }
    };

    function setup() {
        $scope.constants = constants;
        $scope.variables = variables;
        $scope.functions = functions;

        functions.checkDisplay();
        functions.registerEventListeners();
    }

    setup();
}]);