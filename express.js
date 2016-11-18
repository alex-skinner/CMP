var express = require('express');
var app = express();
var http = require('http');
var apiHelper = require('./server/apiHelper');
var Bamboo = require('bamboo-api');

var _BAMBOO_OPTIONS = apiHelper.getBambooOptions();
var _BAMBOO_LOGIN = apiHelper.getBambooLogin();
var _BAMBOO_URL = apiHelper.getBambooUrl();
app.use(express.static(__dirname));

var bamboo = new Bamboo(_BAMBOO_URL, _BAMBOO_LOGIN.username, _BAMBOO_LOGIN.password);

app.post('/api/bambooDeploy', function (req, res) {
    var bambooId = req.query.id;
    bamboo.buildPlan(bambooId, function (error, result) {
        if (error) {
            res.status(400).send(error);
            return;
        }
        res.send(result);
    });
});

app.listen(process.env.PORT || 3000);
console.log("app listening on port", process.env.PORT || 3000);