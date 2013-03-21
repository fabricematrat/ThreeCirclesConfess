var threecirclesconfess = threecirclesconfess || {};
threecirclesconfess.view = threecirclesconfess.view || {};

threecirclesconfess.view.geolocation = function () {
    var that = {};
    that.map = null;

    var markers = [];

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var removeMarker = function (id) {
        var marker = markers[id];
        if (marker) {
            marker.setMap(null);
            delete markers[id];
        }
    };

    var removeMarkers = function () {
        $.each(markers, function (key, marker) {
            marker.setMap(null);
            delete markers[key];
        });
    };

    //var onSuccess =  ;

    var onError = function() {
        handleNoGeolocation(true);
    };

    var handleNoGeolocation = function(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }
        var options = {
            map: that.map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };
        that.map.setCenter(options.position);
    }

    that.showMap = function(canvas, latitude, longitude) {
        var pos = new google.maps.LatLng(latitude, longitude);
        if (!that.map) {
            that.map = new google.maps.Map(document.getElementById(canvas), mapOptions);
        }

        that.map.setCenter(new google.maps.LatLng(latitude, longitude));
        var html = '<div style="width:500px%; display:inline;"><span><textarea name="textarea-1" id="textarea-1" placeholder="What are you up to?"></textarea></span><div><img src="http://placehold.it/100x50/8e8"/><img src="http://placehold.it/100x50/8e8"/></div></div>'
        var infowindow = new google.maps.InfoWindow({
            map: that.map,
            position: pos,
            content: html
        });
    };


    that.showMapWithPlaces = function(canvas, pois, myFunction) {
        if (!that.map) {
            that.map = new google.maps.Map(document.getElementById(canvas), mapOptions);
        }

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                that.map.setCenter(pos);

                var request = {
                    bounds: that.map.getBounds()/*,
                     rankBy: google.maps.places.RankBy.DISTANCE*/
                };

                removeMarkers();

                var service = new google.maps.places.PlacesService(that.map);
                service.nearbySearch(request, function (results, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        alert(status);
                        return;
                    }
                    for (var i = 0, result; result = results[i]; i++) {

                        var img = result.icon;
                        var name = result.name;
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(pos, result.geometry.location);
                        var lat = result.geometry.location.lat();
                        var lng = result.geometry.location.lng();
                        var li = $('<li>');
                        var a = $('<a>')
                        a.on('click tap', function(event) {
                           myFunction(lat, lng);
                        });

                        a.attr({
                            href: "#checkin",
                            'data-transition': "slide"
                        });

                        a.append('<img src="'+ img+'"/><h2>'+ name + '</h2><p>' + distance + ' km</p>');

                        li.append(a);
                        $("#" + pois).append(li);
                        var marker = new google.maps.Marker({
                            map: that.map,
                            position: result.geometry.location
                        });

                        markers.push(marker);
                    }
                    $("#" + pois).listview("refresh");
                });
            }, onError);
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    };
    return that;
};