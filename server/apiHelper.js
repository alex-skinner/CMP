var _BAMBOO_BASE_URL = "_REMOVED";
var _BAMBOO_PORT = 8085;
var _BAMBOO_PATH = "/rest/api/latest/queue/";
var _BAMBOO_USERNAME = '_REMOVED';
var _BAMBOO_PASSWORD = '_REMOVED';

var _BAMBOO_OPTIONS = {
    host: _BAMBOO_BASE_URL,
    port: _BAMBOO_PORT,
    path: _BAMBOO_PATH,
    method: "POST",
    auth: _BAMBOO_USERNAME+':'+_BAMBOO_PASSWORD,
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports = {
    getBambooOptions: function() {
        return _BAMBOO_OPTIONS;
    },
    getBambooLogin: function() {
        return {
            username: _BAMBOO_USERNAME,
            password: _BAMBOO_PASSWORD
        };
    },
    getBambooUrl: function() {
        return "http://"+_BAMBOO_BASE_URL+":"+_BAMBOO_PORT;
    }
};