/**
* JourneyCtrl
* This controller manages the selected journey page,
* it gets the datas from the API and
* format them to be displayed as needed.*/

app.controller('JourneyCtrl', function($scope, $http) {

    $scope.segments = [];
    var hasMain = false;


    /**
    * Data retrieval from the API */

    $.getJSON(API, function(json) {
        $scope.journeys = [];
        $scope.otherJourneys = [];
        var segments = json.data.booking.segment;
        var segments = $.map(segments, function(value, index) {
            return [value];
        });
        $scope.currentJourney = {
            priceInteger: Math.floor(json.data.booking.total / 100),
            priceDecimal: json.data.booking.total % 100
        }

        segments.forEach(function(segment) {
            var journeyIds = segment.journey;
            journeyIds.forEach(function(journeyId) {
                var journey = segment[journeyId];
                journey = formatJourney(journey);
                if(journeyId === segment.journey[0]) {
                    if(hasMain) {
                        journey.main = 'Retour :';
                    } else {
                        journey.main = 'Aller :';
                        hasMain = true;
                    }
                }
                $scope.journeys.push(journey);
            });
        });
        $(window).on("load", function() {
            $scope.$apply();
            $('#loader').hide();
            $('#content').show();
        });

    });


    /**
    * This function format a journey to be displayed.
    *  @param {Object} journey the journey to format.
    *  @returns {Object} the formatted object. */

    function formatJourney(journey) {
        var dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
        var timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        var journeyBegin = new Date(Date.parse(journey.begin));
        var journeyEnd = new Date(Date.parse(journey.end));
        var hours = Math.floor(journey.duration.minutes / 60);
        var minutes = journey.duration.minutes % 60;
        var journeyDuration = hours + "h" + minutes + "m";
        var journeyStops = journey.stop.replace(/\D/g, "");
        var journeyToPush = {
            beginDate:  journeyBegin,
            beginStr:   journeyBegin.toLocaleDateString('fr-FR', dateOptions),
            beginTime:  journeyBegin.toLocaleTimeString([], timeOptions),
            from:       journey.from,
            to:         journey.to,
            endDate:    journeyEnd,
            endStr:     journeyEnd.toLocaleDateString('fr-FR', dateOptions),
            endTime:    journeyEnd.toLocaleTimeString([],timeOptions),
            duration:   journeyDuration,
            luggages:   2,
            stops:      journeyStops,
            carrier:    journey.carrier[0].code
        };
        return journeyToPush;
    }


    /**
    * This function toggles alternative journeys
    * with a fade effect.*/

    $scope.toggleOtherJourneys = function() {
        $('.other').fadeToggle();
    }

});
