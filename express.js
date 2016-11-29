var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var Bamboo = require('bamboo-api');
var adal = require('adal-node');
var rest = require('restler');
var NodeCache = require('node-cache');
var events = require('events');
var _ = require('underscore');
var apiHelper = require('./server/apiHelper');
var azureAPI = require('./server/azureAPI');
var databaseHelper = require('./server/databaseHelper');

var app = express();
app.use(bodyParser.json());
var eventEmitter = new events.EventEmitter();

var baseUrl = "https://management.azure.com/subscriptions";
var subID = "311818f8-d369-419b-bfe1-fdf644de096f";
var cache = new NodeCache({
    checkperiod: 60
});

var _CACHE_BEARERTOKEN = "Azure.BearerToken";
var _CACHE_RATECARD = "Azure.RateCard";
var _CACHE_TENANTID = "Azure.TenantID";
var _CACHE_CLIENTID = "Azure.ClientID";
var _CACHE_SECRET = "Azure.SecretKey";

var _EV_TOKENAQUIRED = "event.token.aquired";
var _EV_RATECARDAQUIRED = "event.ratecard.aquired";
var _EV_DBCONNECTESTAB = "event.database.connectionEstablished";
var _EV_DBGETCONFIG = "event.database.configAquired";

var _AZURE_API_VERSION = "2016-02-01";

/* 
    Writes the data (=item) into the cache and stores it under a Key (=name). 
    A time to live (=ttl) can also be specified.
*/
function writeCache(name, item, ttl) {
    function cacheCallback(err, success) {
        if (!err && success) {
            console.log('CC --', name, "was successfully stored in the cache");
        } else {
            console.warn('CC --', name, "could not be stored in the cache");
        }
    }
    if (ttl) {
        cache.set(name, item, ttl, cacheCallback);
    } else {
        cache.set(name, item, cacheCallback);
    }
}

/* 
    Retrives item stored in the cache. The key (=name) must be passed into the function
*/
function retrieveCache(name) {
    var cacheValue = null;
    if (name) {
        cache.get(name, function (err, value) {
            if (!err) {
                console.info("CC -- Successfully retrieved", name, "from the cache");
                cacheValue = value;
            } else {
                console.warn("CC -- ERROR -- Could not retrieve", name, "from the cache");
            }
        });
    } else {
        console.error("CC -- ERROR -- Valid key 'name' was not passed into function (retrieveCache)");
    }
    return cacheValue;
}

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

app.get('/api/azure/getResourceGroups', function (req, res) {
    var apiUrl = baseUrl + "/" + subID + "/resourcegroups?api-version=" + _AZURE_API_VERSION;
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getResourceGroup', function (req, res) {
    var rgName = req.query.name;
    var apiUrl = baseUrl + "/" + subID + "/resourceGroups/" + rgName + "/resources?api-version=" + _AZURE_API_VERSION;
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getSubscriptions', function (req, res) {
    var apiUrl = baseUrl + "?api-version=" + _AZURE_API_VERSION;
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getImagePublishers', function (req, res) {
    var location = typeof req.query.location === 'undefined' ? 'northeurope' : req.query.location;
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Compute/locations/" + location + "/publishers?api-version=2016-03-30";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getImageOffers', function (req, res) {
    var location = typeof req.query.location === 'undefined' ? 'northeurope' : req.query.location;
    var publisherName = typeof req.query.pubName === 'undefined' ? 'MicrosoftWindowsServer' : req.query.pubName;
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Compute/locations/" + location + "/publishers/" + publisherName + "/artifacttypes/vmimage/offers?api-version=2016-03-30";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getImageSkus', function (req, res) {
    var location = typeof req.query.location === 'undefined' ? 'northeurope' : req.query.location;
    var publisherName = typeof req.query.pubName === 'undefined' ? 'MicrosoftWindowsServer' : req.query.pubName;
    var offer = typeof req.query.offer === 'undefined' ? 'WindowsServer' : req.query.offer;
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Compute/locations/" + location + "/publishers/" + publisherName + "/artifacttypes/vmimage/offers/" + offer + "/skus?api-version=2016-03-30";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getImageVersions', function (req, res) {
    var location = typeof req.query.location === 'undefined' ? 'northeurope' : req.query.location;
    var publisherName = typeof req.query.pubName === 'undefined' ? 'MicrosoftWindowsServer' : req.query.pubName;
    var offer = typeof req.query.offer === 'undefined' ? 'WindowsServer' : req.query.offer;
    var sku = typeof req.query.sku === 'undefined' ? '2012-R2-Datacenter' : req.query.sku;
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Compute/locations/" + location + "/publishers/" + publisherName + "/artifacttypes/vmimage/offers/" + offer + "/skus/" + sku + "/versions?api-version=2016-03-30";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/azure/getVmSize', function (req, res) {
    var location = typeof req.query.location === 'undefined' ? 'northeurope' : req.query.location;
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Compute/locations/" + location + "/vmSizes?api-version=2015-06-15";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.put('/api/azure/createVm', function (req, res) {
    var rgName = req.query.rgname;
    var vmName = req.query.vmname;
    var data = req.body;
    //console.log('body data is', data);
    console.log("vmName:", vmName, "rgName:", rgName);
    var apiUrl = baseUrl + "/" + subID + "/resourceGroups/" + rgName + "/providers/Microsoft.Compute/virtualMachines/" + vmName + "?api-version=2016-03-30";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.putAzureApi(apiUrl, res, token, data);
});

app.get('/api/billing/getRateCard', function (req, res) {
    res.send(retrieveCache(_CACHE_RATECARD));
});

app.get('/api/billing/getUsage', function (req, res) {
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Commerce/UsageAggregates?api-version=2015-06-01-preview&reportedstartTime=2016-08-01+00%3a00%3a00Z&reportedEndTime=2016-11-22+00%3a00%3a00Z";
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getAzureApi(apiUrl, res, token);
});

app.get('/api/database/getTemplate', function (req, res) {
    var templateId = typeof req.query.templateId === 'undefined' ? res.status(400).send(new Error('No templateId defined')) : req.query.templateId;
    databaseHelper.getTemplate(templateId, function(data) {
        if(data instanceof Error) {
            res.status(400).send(data);
        } else {
            res.send(data);
        }
    });
});

function registerEvents() {
    cache.on("del", function (key, value) {
        if (key === _CACHE_BEARERTOKEN) {
            console.log("Bearer token cache expired");
            getAzureBearerToken();
        } else if (key === _CACHE_RATECARD) {
            console.log("Rate card cache expired");
            getRateCard();
        }
    });
}

function getAzureBearerToken() {
    console.log("AZ -- Obtaining Azure Bearer token");
    var token = null;
    var AuthenticationContext = adal.AuthenticationContext;
    var tenantID = retrieveCache(_CACHE_TENANTID);
    var clientID = retrieveCache(_CACHE_CLIENTID);
    var secret = retrieveCache(_CACHE_SECRET);
    var resource = "https://management.azure.com/";
    var authURL = "https://login.windows.net/" + tenantID;
    var context = new AuthenticationContext(authURL);
    context.acquireTokenWithClientCredentials(resource, clientID, secret, function (err, tokenResponse) {
        if (err) {
            console.warn("AZ -- ERROR -- Could not obtain the Azure token", err.stack);
        } else {
            token = tokenResponse.accessToken;
            console.log("AZ -- Successfully obtained the Azure token");
            writeCache(_CACHE_BEARERTOKEN, token, 3540); //3540 = 59mins as Bearer token lifespan is 60 mins
            eventEmitter.emit(_EV_TOKENAQUIRED);
        }
    });
    return token;
}

function getRateCard() {
    var token = retrieveCache(_CACHE_BEARERTOKEN);
    azureAPI.getRateCard(baseUrl, subID, token, function (result) {
        //var sorted = splitRateCard(result);
        writeCache(_CACHE_RATECARD, result, 7200); //7200 is every 2 hours
        eventEmitter.emit(_EV_RATECARDAQUIRED);
    });
}

function splitRateCard(rateCard) {
    var grouped = _.groupBy(rateCard.Meters, "MeterCategory");
    var sorted = _.sortBy(grouped["Virtual Machines"], "MeterSubCategory");
    var virtualMachines = _.indexBy(grouped["Virtual Machines"], "MeterSubCategory");
    return virtualMachines;
}

function getDBConfig() {
    console.log('DB -- Getting config');
    databaseHelper.getConfig(function (data) {
        if (!(data instanceof Error)) {
            data.forEach(function (item, index) {
                switch (item.key_name) {
                    case 'tenantID':
                        writeCache(_CACHE_TENANTID, item.key_value, 0);
                        break;
                    case 'clientID':
                        writeCache(_CACHE_CLIENTID, item.key_value, 0);
                        break;
                    case 'secret':
                        writeCache(_CACHE_SECRET, item.key_value, 0);
                        break;
                    default:
                        console.log('DB -- Config key name not found');
                        break;
                }
            });
        }
        eventEmitter.emit(_EV_DBGETCONFIG);
    });
}

function setupWebApp() {
    console.log("APP -- Setting up app");
    //1. Open up a connection to the database
    databaseHelper.connect(function () {
        eventEmitter.emit(_EV_DBCONNECTESTAB);
    });
    //2. Get config
    eventEmitter.once(_EV_DBCONNECTESTAB, getDBConfig);
    //3. Get Azure Bearer Token
    eventEmitter.once(_EV_DBGETCONFIG, getAzureBearerToken);
    //4. Get Azure Rate Card
    eventEmitter.once(_EV_TOKENAQUIRED, getRateCard);

    //var config = databaseHelper.getConfig();
    registerEvents(getRateCard);

    //Initial setup has been completed so the application can start listening
    eventEmitter.once(_EV_RATECARDAQUIRED, function () {
        app.listen(process.env.PORT || 30000);
        console.log("APP -- Initial config completed");
        console.log("APP -- listening on port", process.env.PORT || 30000);
    });
}

setupWebApp();