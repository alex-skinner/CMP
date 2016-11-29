mainModule.service('dashboardApiSrv', ['$http', function ($http) {

    var srv = this;

    srv.deploy = function (type, id) {
        if (type === 'Bamboo') {
            return $http.post('api/bambooDeploy?id=' + id);
        }
    };

    srv.getResourceGroups = function () {
        return $http.get('api/azure/getResourceGroups');
    };

    srv.getResourceGroup = function (name) {
        return $http.get('api/azure/getResourceGroup?name=' + name);
    };

    srv.deployTest = function(payload, vmName, rgName) {
        return $http.put('api/azure/createVm?vmname='+vmName+'&rgname='+rgName, payload);
    };

}]); 