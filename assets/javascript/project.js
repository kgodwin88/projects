$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyDK5bKY5Pqm0_gg_mbnOo6UPmIQHbaZNC4",
        authDomain: "project1-f4f3e.firebaseapp.com",
        databaseURL: "https://project1-f4f3e.firebaseio.com",
        projectId: "project1-f4f3e",
        storageBucket: "project1-f4f3e.appspot.com",
        messagingSenderId: "303098997727"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var auth = firebase.auth();
    $("#modalSignIn").on("click", function(){
        event.preventDefault();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        auth.signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            $("#header").text("Error");
            $("#message").text(errorMessage)
          });
          $("#modalForm")[0].reset();
          $("#signin").modal("hide");
          $("#welcome").modal("show")
    });
    $("#createAccount").on("click", function(){
        event.preventDefault();
        var firstName = $("#firstName").val().trim();
        var lastName = $("#lastName").val().trim();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
        $("#modalForm")[0].reset();
        $("#signup").modal("hide");
        function displayName(){
            usersName = firstName + " " + lastName;
            user.updateProfile({
                displayName: usersName
            });
        };
        
    });
    $("#logout").on("click", function(){
        auth.signOut().then(function() {
            // Sign-out successful.
            location.reload(); 
          }).catch(function(error) {
            // An error happened.
          });
    });
    auth.onAuthStateChanged(function(user){
        if(user){
            displayName();
            $("#header").text("Welcome")
            $("#logout").removeClass("d-none");
            $("#signIn").addClass("d-none");
            $("#signUp").addClass("d-none");
            var userId = auth.currentUser.uid;
            console.log("on auth change " + userId)
            $("#message").text(userId);
            $("#addFavorite").on("click", function(event){
                event.preventDefault();
                var artist = $("#artist").val().trim();
                var song = $("#song").val().trim();
                var newArtist = {
                    name: artist,
                    song: song,             
                };
                if(artist === "" && song === ""){
    
                }
                else{
                    database.ref(userId).push(newArtist);
                    console.log("inside the function " + userId);
                }
                $("#artistForm")[0].reset();      
                });
                
                database.ref(userId).on("child_added", function(snapshot){
                    var name = snapshot.val().name;
                    var song = snapshot.val().song;
                    $("#favoritesTable > tbody").append("<tr value =" + name + song + "><td>" + name + "</td><td>" + song + "</td></tr>")
                });
        }
        else{
            console.log("logged out");
            $("#logout").addClass("d-none");
            $("#signIn").removeClass("d-none");
            $("#signUp").removeClass("d-none");
            $("#favoritesTable > tbody").empty();
        };
    });

    $("#addMusic").on("click", function(event){
        event.preventDefault();
        var artist = $("#artist").val().trim();
        var song = $("#song").val().trim();
        var youtubeApi = "https://www.googleapis.com/youtube/v3/search";
        var apiKey = "AIzaSyDEym1vh-fifGJYrmrz0WsPCyQU6Uni6aQ";
        var query = artist + "+" + song;
        console.log(artist)
        $.ajax({
            url: youtubeApi,
            data:{
                key: apiKey,
                part: "snippet",
                type: "video",
                q: query,
                order: "viewCount",
                maxResults: 2
            },
            method: "GET"
        })
        .then(function(response){
            var results = response.items;
            for(var i = 0; i < results.length; i ++){
                var title =  $("<h2>").text(results[i].snippet.title);
                var videoId = results[i].id.videoId;
                var videoDiv = $("<div>");
                var videoFrame = $("<iframe>");
                var source = "https://www.youtube.com/embed/" + videoId;
                videoFrame.attr("src", source);
                videoDiv.append(title, videoFrame);
                $("#videos").append(videoDiv);

            }
            
        });

        
        $.ajax({
            url : "https://api.musixmatch.com/ws/1.1/track.search",
                

            data:{
                apikey: "fec873930376f5f5c372618b84d70381",
                q: query,
                page: 1,
                page_size: 1,
                s_track_rating: "desc",
                format: "jsonp",
                callback: "jsonp_callback" 
            },
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            method: "GET"
        })
        .then(function(data){
            var trackId = data.message.body.track_list[0].track.track_id;
            var title = data.message.body.track_list[0].track.track_name;
    
            $.ajax({
                url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get?",
                data:{
                    apikey: "fec873930376f5f5c372618b84d70381",
                    track_id: trackId,
                    format: "jsonp",
                    callback: "jsonp_callback"
                },
                dataType: "jsonp",
                jsonpCallback: 'jsonp_callback',
                contentType: 'application/json',
                method: "Get"
            })
            .then(function(data){
                var lyrics = data.message.body.lyrics.lyrics_body;
                var lyricsDiv = $("<div>");
                var hLyrics = $("<h2>").text(title);
                var pLyrics = $("<p>").text(lyrics);
                lyricsDiv.append(hLyrics);
                lyricsDiv.append(pLyrics);
                $("#lyrics").append(lyricsDiv);
            })
        });
      $.ajax({
          url: "https://ws.audioscrobbler.com/2.0/",
          data:{
              method: "artist.getinfo",
              api_key: "6b6d7e9814cf2cb428f0a568b1fa3659",
              format: "json",
              artist: artist,
              lang: "en",
            },
        })
          .then(function(response){
              var bio = response.artist.bio.content;
              var bioDiv = $("<div>");
              var name = $("<h2>").text(artist);
              var pBio = $("<p>").text(bio);
              bioDiv.append(name);
              bioDiv.append(pBio);
              $("#bio").append(bioDiv);
          })
        $("#artistForm")[0].reset();

    });
   
   
    
});