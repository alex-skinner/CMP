mainModule.service('dashboardApiSrv', ['$http', function ($http) {

    var srv = this;

    srv.deploy = function (type, id) {
        if (type === 'Bamboo') {
            return $http.post('api/bambooDeploy?id=' + id);
        }
    };

    srv.getResourceGroups = function () {
        return $http.get('api/getResourceGroups');
    };

    srv.getResourceGroup = function (name) {
        return $http.get('api/getResourceGroup?name=' + name);
    };

}]);