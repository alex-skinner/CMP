var express = require('express');
var http = require('http');
var Bamboo = require('bamboo-api');
var adal = require('adal-node');
var rest = require('restler');
var NodeCache = require('node-cache');
var events = require('events');
var apiHelper = require('./server/apiHelper');
var azureBilling = require('./server/azureBilling');

var app = express();
var eventEmitter = new events.EventEmitter();

var subscriptionId = "311818f8-d369-419b-bfe1-fdf644de096f";
var baseUrl = "https://management.azure.com/subscriptions";
var subID = "311818f8-d369-419b-bfe1-fdf644de096f";
var cache = new NodeCache({
    checkperiod: 60
});

var _CACHE_TOKENNAME = "AzureToken";
var _CACHE_RATECARDNAME = "AzureRateCard";
var _EV_TOKENAQUIRED = "event.token.aquired";
var _EV_RATECARDAQUIRED = "event.ratecard.aquired";

function getAzureBearerToken() {
    console.log("Getting Azure Bearer token");
    var token = null;
    var AuthenticationContext = adal.AuthenticationContext;
    var tenantID = "e4bc8d17-4d20-4b58-8eb5-ec06e4d91b3b";
    var clientID = "012221fb-ebc5-4f6d-95b6-86e7103f7340";
    var resource = "https://management.azure.com/";
    var authURL = "https://login.windows.net/" + tenantID;
    var secret = "SaAzVKd+6R9MwqzGjTBk5ggP4l09vIT2RShi4cq3U00=";
    var context = new AuthenticationContext(authURL);
    context.acquireTokenWithClientCredentials(resource, clientID, secret, function (err, tokenResponse) {
        if (err) {
            console.log("An error occured", err.stack);
        } else {
            token = tokenResponse.accessToken;
            console.log("Successfully retrieved the Azure token");
            writeCache(_CACHE_TOKENNAME, token, 3540); //3540 = 59mins as Bearer token lifespan is 60 mins
            eventEmitter.emit(_EV_TOKENAQUIRED);
        }
    });
    return token;
}

/* 
    Writes the data (=item) into the cache and stores it under a Key (=name). 
    A time to live (=ttl) can also be specified.
*/
function writeCache(name, item, ttl) {
    function cacheCallback(err, success) {
        if (!err && success) {
            console.log(name, "was successfully stored in the cache");
        } else {
            console.warn(name, "could not be stored in the cache");
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
                console.info("Successfully retrieved", name);
                cacheValue = value;
            } else {
                console.warn("Could not retrieve", name);
            }
        });
    } else {
        console.error("Valid key 'name' was not passed into function (retrieveCache)");
    }
    return cacheValue;
}

/*
    Get request through the AzureAPI to the passed in URL (=apiUrl). A reference to
    the result object (=res) that is created at the node endpoint is also passed into
    so that html responses can be returned.
*/
function getAzureAPI(apiUrl, res) {
    var token = retrieveCache(_CACHE_TOKENNAME);
    if (!token) {
        getAzureBearerToken();
        res.status(500).send("Unable to retrieve bearer token");
    } else {
        rest.get(apiUrl, {
            accessToken: token
        }).on('complete', function (result) {
            res.send(result);
        }).on('error', function (error) {
            res.send(error);
        });
    }
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

app.get('/api/getResourceGroups', function (req, res) {
    var apiUrl = baseUrl + "/" + subID + "/resourcegroups?api-version=2016-02-01";
    getAzureAPI(apiUrl, res);
});

app.get('/api/getResourceGroup', function (req, res) {
    var rgName = req.query.name;
    var apiUrl = baseUrl + "/" + subID + "/resourceGroups/" + rgName + "/resources?api-version=2016-02-01";
    getAzureAPI(apiUrl, res);
});

app.get('/api/billing/getUsage', function (req, res) {
    var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Commerce/UsageAggregates?api-version=2015-06-01-preview&reportedstartTime=2016-08-01+00%3a00%3a00Z&reportedEndTime=2016-11-22+00%3a00%3a00Z";
    getAzureAPI(apiUrl, res);
});

app.get('/api/getSubscriptions', function (req, res) {
    var apiUrl = baseUrl + "?api-version=2016-02-01";
    getAzureAPI(apiUrl, res);
});

app.get('/api/billing/getRateCard', function (req, res) {
    console.log('hello world');
});
 
function registerEvents(callback) {
    cache.on("del", function (key, value) {
        if (key === _CACHE_TOKENNAME) {
            console.log("Bearer token cache expired")
            getAzureBearerToken();
        } else if (key === _CACHE_RATECARDNAME) {
            console.log("Rate card cache expired");
            getRateCard();
        }
    });
    eventEmitter.once(_EV_TOKENAQUIRED, callback);
}

function getRateCard() {
    var token = retrieveCache(_CACHE_TOKENNAME);
    azureBilling.getRateCard(baseUrl, subID, token, function(item) {
        writeCache(_CACHE_RATECARDNAME, item, 7200); //7200 is every 2 hours
        eventEmitter.emit(_EV_RATECARDAQUIRED);
    });
}

function setupWebApp() {
    console.log("Setting up app...");
    registerEvents(getRateCard);
    getAzureBearerToken();
    //Initial setup has been completed so the application can start listening
    eventEmitter.once(_EV_RATECARDAQUIRED, function() {
        app.listen(process.env.PORT || 30000);
        console.log("app listening on port", process.env.PORT || 30000);
    });
}

setupWebApp(); 