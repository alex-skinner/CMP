var sql = require('mssql');
var config = {
    user: 'srv_cmp',
    password: '_REMOVED',
    server: 'localhost',
    database: 'cmp_db',
    options: {
        encrypt: false //true if using Azure SQL
    }
};

var _CONNECTION = null;

module.exports = {
    connect: function (callback) {
        console.log('DB -- Opening SQL connection');
        _CONNECTION = new sql.Connection(config, function (err) {
            if (!err) {
                console.log("DB -- Connection open");
                callback();
                return true;
            } else {
                console.log(err);
                return false;
            }
        });
    },
    getConfig: function (callback) {
        var query = "Select * from config";
        runQuery(query, callback);
    },
    getTemplate: function (templateId, callback) {
        var query = "select * from templateDefinitions INNER JOIN templateTypes ON templateDefinitions.type_id=templateTypes.id Where templateDefinitions.id = '" + templateId +"'";
        runQuery(query, callback);
    }
};

function runQuery(query, callback) {
    if (checkConnection()) {
        var request = new sql.Request(_CONNECTION);
        request.query(query).then(function (recordset) {
            if (typeof callback === 'function') {
                callback(recordset);
            }
            return recordset;
        }).catch(function (err) {
            console.log(err);
            return Error(err);
        });
    } else {
        console.log("DB -- Could not connect to the database");
        var error = new Error("Could not connect to the database");
        callback(error);
    }
}

function checkConnection() {
    if (!_CONNECTION) {
        if (!connect()) {
            _CONNECTION.on('connect', function () {
                return true;
            });
        } else {
            return false;
        }
    } else {
        return true;
    }
}