var threecirclesconfess = threecirclesconfess || {};
threecirclesconfess.view = threecirclesconfess.view || {};

threecirclesconfess.view.timeline = function () {
    var that = {};
    var TEN_MINUTES = 600000;
    var ONE_DAY = 86400000;
    var ONE_MINUTE = 60000;
    var ONE_HOUR = 3600000;

    that.revisitTimeInformation = function(item) {
        //$.each(model.getItems(), function(key, value) {
           var date = parseDate(item.when);
           item.whenAsTimeline = that.getWhenInformation(date);
        return item;
        //});

    };

    that.getWhenInformation = function (dateAsString) {
        return whenAsTimeline = that.getWhenInformationFromDate(Date.parse(dateAsString));
    }

    that.getWhenInformationFromDate = function (date) {
        var now = new Date().getTime();
        var earlier = date;
        var diff = now - earlier;
        if (diff < TEN_MINUTES) {    // less than 10 mins
           return "just now";
        }
        if (TEN_MINUTES <diff && diff < ONE_DAY) {  // between 10 mins to one day
            var minutes = integerDivision(diff, ONE_MINUTE);
            var hours = integerDivision(diff, ONE_HOUR);
            if (hours) {
                var minutesLeft = integerDivision(hours.remainder, ONE_MINUTE);
                return hours.quotient + " hours " + minutesLeft.quotient + " minutes ago";
            } else {
                return minutes.quotient + " minutes ago";
            }
        }
        if (ONE_DAY < diff && diff < 30 * ONE_DAY) {
            var days = integerDivision(diff, ONE_DAY);
            if (days) {
                return days.quotient + " days ago";
            }
        }
        return "some time ago";
    }

    var integerDivision = function (numerator, denominator) {
        var remainder = numerator % denominator;
        var quotient = ( numerator - remainder ) / denominator;
        if ( quotient >= 0 ) {
            quotient = Math.floor( quotient );
        }
        else { // negative
            quotient = Math.ceil( quotient );
        }
        return {remainder: remainder, quotient: quotient};
    }

    return that;
};