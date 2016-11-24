var rest = require('restler');

module.exports = {
    getRateCard: function (baseUrl, subID, token, writeRateCard) {
        var offerID = "MS-AZR-0017P";
        var currency = "GBP";
        var locale = "en-GB";
        var regionInfo = "GB";
        var apiUrl = baseUrl + "/" + subID + "/providers/Microsoft.Commerce/RateCard?api-version=2015-06-01-preview&$filter=OfferDurableId eq '" + offerID + "' and Currency eq '" + currency + "' and Locale eq '" + locale + "' and RegionInfo eq '" + regionInfo + "'";
        rest.get(apiUrl, {
            accessToken: token
        }).on('complete', function (result) {
            console.log('Rate Card retrieved from Azure');
            writeRateCard(result);
        }).on('error', function (error) {
            console.log('Rate card could not be retrieved');
        });
    }
};