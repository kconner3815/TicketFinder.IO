$(document).ready(function () {

    var apikey = "&apikey=uBAJZ1xFbGFg9COL6Nukmnihg3I4Akl8";
    var rootURL = "https://app.ticketmaster.com/discovery/v2/";
    var parameter = "events.json?";
    var events = [];

    $("#search-button").on("click", function (event) {

        event.preventDefault();

        var city = $("#city-input").val();
        var date = $("#date-input").val();
        var queryURL = rootURL + parameter + "city=" + city + "&startDateTime=" + date + "T00:00:00Z&endDateTime=" + date + "T23:59:00Z" + apikey;

        $.ajax({
            url: queryURL,
            type: "GET",
            async: true,
            dataType: "json",
            success: function (response) {

                var result = response._embedded.events;
                events = [...result];

                for (var i = 0; i < result.length; i++) {

                    var eventName = (result[i].name); //event name
                    var eventId = (result[i].id); //event id
                    var eventType = (result[i].classifications[0].segment.name); //event type
                    var eventDate = (result[i].dates.start.localDate); // date
                    var eventImage = (result[i].images[9].url); //image pull
                    var ticketLink = (result[i].url); // ticket link
                    var eventVenue = (result[i]._embedded.venues[0].name); // venue

                    var eventDiv = $("<div>");
                    eventDiv.addClass("container");

                    var eventRow = $("<div>");
                    eventRow.addClass("row");
                    eventRow.appendTo(eventDiv);

                    var imgCol = $("<div>");
                    imgCol.addClass("col-6");
                    imgCol.appendTo(eventRow);

                    var eventImageDisplay = $("<img src=" + eventImage + " class='event-img'>")
                    eventImageDisplay.appendTo(imgCol);

                    var eventInfoCol = $("<div>");
                    eventInfoCol.addClass("col-6");
                    eventInfoCol.appendTo(eventRow);

                    var eventNameDisplay = $("<h1>" + eventName + "</h1>");
                    eventNameDisplay.appendTo(eventInfoCol);

                    var eventDateDisplay = $("<h3>When: " + eventDate + "</h3>");
                    eventDateDisplay.appendTo(eventInfoCol);

                    var eventTypeDisplay = $("<h3>Type of Event: " + eventType + "</h3>");
                    eventTypeDisplay.appendTo(eventInfoCol);

                    var eventVenueDisplay = $("<h3>@ " + eventVenue + "</h3>");
                    eventVenueDisplay.appendTo(eventInfoCol);

                    var ticketButtonDisplay = $("<a href=" + ticketLink + " target='_blank'><button class='buy-ticket-btn'>Buy Tickets</button></a>");
                    ticketButtonDisplay.appendTo(eventInfoCol);

                    var calendarButtonDisplay = $("<button>");
                    calendarButtonDisplay.text("Add to calendar");
                    calendarButtonDisplay.attr("data-id", eventId);
                    calendarButtonDisplay.addClass("calendar-btn");
                    calendarButtonDisplay.appendTo(eventInfoCol);

                    $("#event-display").prepend(eventDiv);

                };
            },
            error: function (xhr, status, err) {
            }
        });
    });

    function authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/calendar.events" })
            .then(function (response) {
                $("#sign-in-btn").text("Welcome, " + response.w3.ofa);
                console.log("Sign-in successful");
            },
                function (err) { console.error("Error signing in", err); });
    };

    function loadClient() {
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(function () {
                console.log("GAPI client loaded for API");
            },
                function (err) { console.error("Error loading GAPI client for API", err); });
    };

    function getCalendarId() {
        return gapi.client.calendar.calendarList.get({
            "calendarId": "primary"
        }).then(function () {
            console.log("Calendar Id recieved");
        },
            function (err) { console.error("Execute error", err); });
    };

    gapi.load("client:auth2", function () {
        gapi.auth2.init({ client_id: "761159949102-63fctob7rap5qtud1rd70o6e9rt5kplk.apps.googleusercontent.com" });
    });

    $("#sign-in-btn").on("click", function () {
        authenticate().then(loadClient);
    });

    $(document).on("click", ".calendar-btn", function () {

        getCalendarId();

        var selectedEventId = $(this).attr("data-id");
        var selectedEvent = events.find(event => event.id === selectedEventId);
        var data = {
            "summary": selectedEvent.name + " @ " + selectedEvent._embedded.venues[0].name,
            "end": {
                "date": selectedEvent.dates.start.localDate,
            },
            "start": {
                "date": selectedEvent.dates.start.localDate,
            },
        };

        return gapi.client.calendar.events.insert({
            "calendarId": "primary",
            "resource": data,
        }).then(function () {
            console.log("Event Successfully added");
            alert("Event successfully added");
        },
            function (err) { console.error("Execute error", err); });
    });
});
