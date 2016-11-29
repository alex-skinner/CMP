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
        deploymentItem: null,
        exampleJson: {
            "properties": {
                "hardwareProfile": {
                    "vmSize": "Standard_D2_v2"
                },
                "storageProfile": {
                    "imageReference": {
                        "publisher": "MicrosoftWindowsServer",
                        "offer": "WindowsServer",
                        "sku": "2012-R2-Datacenter",
                        "version": "latest"
                    },
                    "osDisk": {
                        "name": "cmptestosdisk",
                        "vhd": {
                            "uri": "https://cmptestsa3.blob.core.windows.net/vhds/osdisk.vhd"
                        },
                        "caching": "None",
                        "createOption": "fromImage"
                    }
                },
                "osProfile": {
                    "computerName": "cmp-test-01",
                    "adminUsername": "cmp_admin",
                    "adminPassword": "Pa$$w0rd!"
                },
                "networkProfile": {
                    "networkInterfaces": [{
                        "properties": {
                            "primary": true
                        },
                        "id": "/subscriptions/311818f8-d369-419b-bfe1-fdf644de096f/resourceGroups/CMP_Test/providers/Microsoft.Network/networkInterfaces/cmp_test_nic"
                    }]
                }
            },
            "id": "cmptestas02",
            "name": "cmptestas02",
            "type": "Microsoft.Compute/virtualMachines",
            "location": "northeurope",
            "tags": {}
        }
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
        testDeploy: function () {
            dashboardApiSrv.deployTest(variables.exampleJson, "cmptestas02", "CMP_Test")
                .success(function (data, status) {
                    toastr.success('All good');
                })
                .error(function (data, status) {
                    toastr.error("An error has occured", data);
                    console.log(data);
                });
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
        registerEventListeners: function () {
            $('#deployModal').on('hidden.bs.modal', function () {
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