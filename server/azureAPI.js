var rest = require('restler');

module.exports = {
    getRateCard: function (baseUrl, subID, token, writeRateCard) {
        console.log('RC -- Obtaining rate card from Azure');
        var offerID = "MS-AZR-0017P";
        var currency = "GBP";
        var locale = "en-GB";
        var regionInfo = "GB";
        var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Commerce/RateCard?api-version=2015-06-01-preview&$filter=OfferDurableId eq '" + offerID + "' and Currency eq '" + currency + "' and Locale eq '" + locale + "' and RegionInfo eq '" + regionInfo + "'";
        rest.get(apiUrl, {
            accessToken: token
        }).on('complete', function (result) {
            console.log('RC -- Rate Card obtained from Azure');
            writeRateCard(result);
        }).on('error', function (error) {
            console.log('RC -- Rate card could not be obtained');
        });
    },
    /*
        Get request through the AzureAPI to the passed in URL (=apiUrl). A reference to
        the result object (=res) that is created at the node endpoint is also passed into
        so that html responses can be returned.
    */
    getAzureApi: function (url, res, token) {
        rest.get(url, {
            accessToken: token
        }).on('complete', function (result) {
            res.send(result);
        }).on('error', function (error) {
            console.log("API -- Could not perform get request");
            res.send(error);
        });
    },
    putAzureApi: function (url, res, token, payload) {
        //var data = JSON.stringify(payload);
        rest.putJson(url, payload, {
            accessToken: token
        }).on('complete', function (result) {
            res.send(result);
        }).on('error', function (error) {
            console.log("API -- Could not perform put request");
            res.send(error);
        });
    }
};