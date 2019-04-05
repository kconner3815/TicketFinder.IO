$(document).ready(function () {

    var apikey = "&apikey=uBAJZ1xFbGFg9COL6Nukmnihg3I4Akl8";
    var rootURL = "https://app.ticketmaster.com/discovery/v2/";
    var parameter = "events.json?";

    $("#search-button").on("click", function (event) {

        event.preventDefault();

        var city = $("#city-input").val();
        var date = $("#date-input").val()

        var queryURL = rootURL + parameter + "city=" + city + "&startDateTime=" + date + "T00:00:00Z&endDateTime=" + date + "T23:59:00Z" + apikey;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            type: "GET",
            async: true,
            dataType: "json",
            success: function (response) {

                var result = response._embedded.events;

                for (var i = 0; i < result.length; i++) {

                    var eventName = (result[i].name); //event name
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

                    var eventNameDisplay = $("<h1>" + eventName + "</h1>")
                    eventNameDisplay.appendTo(eventInfoCol);

                    var eventDateDisplay = $("<h3>When: " + eventDate + "</h3>");
                    eventDateDisplay.appendTo(eventInfoCol);

                    var eventTypeDisplay = $("<h3>Type of Event: " + eventType + "</h3>");
                    eventTypeDisplay.appendTo(eventInfoCol);

                    var eventVenueDisplay = $("<h3>@ " + eventVenue + "</h3>");
                    eventVenueDisplay.appendTo(eventInfoCol);

                    var ticketButtonDisplay = $("<a href=" + ticketLink + "><button class='buy-ticket-btn'>Buy Tickets</button></a>");
                    ticketButtonDisplay.appendTo(eventInfoCol);

                    var calendarButtonDisplay = $("<button>");
                    calendarButtonDisplay.text("Add to calendar");
                    calendarButtonDisplay.addClass("calendar-btn");
                    calendarButtonDisplay.appendTo(eventInfoCol);

                    $("#event-display").prepend(eventDiv)
                };
            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        })
    })

    $("#sign-in-btn").on("click", function () {

        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/calendar');
        firebase.auth().signInWithPopup(provider).then(function (result) {

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            console.log(token);
            // Grabs the user profile
            var userProfile = result.additionalUserInfo.profile;
            // Grabs display name
            var displayName = result.user.displayName;

            //once signed in, changed sign in button to displayName
            $("#sign-in-btn").text(displayName);

            //pushes user profile to database
            database.ref().push(userProfile);

        }).catch(function (error) {

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            // The email of the user's account used.
            var email = error.email;
            
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log(errorCode);
            console.log(errorMessage);
            console.log(email);
            console.log(credential);

        });


    })
})