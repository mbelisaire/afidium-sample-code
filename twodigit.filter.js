/**
* This filter format a number into an integer with at least two digit.
*  @param {string} value the string to format
*  @returns {number} the formatted number. */

app.filter('twodigit', function() {
    return function(value) {
        var valueInt = parseInt(value);
            if(!isNaN(value) && value >= 0 && value < 10) {
                return "0" + valueInt;
            }
        return valueInt;
    }
})
