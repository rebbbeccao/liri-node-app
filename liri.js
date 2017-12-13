var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

function main (command, search) {
   switch (command) {
        case "my-tweets":
            showTweets();
            break;
        case "spotify-this-song":
            showSong(search);
            break;
        case "movie-this":
            showMovie(search);
            break;
        case "do-what-it-says":
            showRandom();
            break;
        default: 
            showRandom();
            break;
   }
};
// Code to grab data [twitterKeys object] from keys.js
function showTweets (){
    var client = new Twitter(keys);
    var params = {screenName: 'rebbbeccao'};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                if (i >= 20) {
                    break;
                }
                console.log(tweets[i].created_at);
                console.log("Tweet: " + tweets[i].text);
                
            }
            
        }
    });

// Code to accept command 'my-tweets'
// [node liri.js my-tweets] will display last 20 tweets and when they were created in terminal 
};

function showSong (songName){
    if (!songName) {
        songName = "The Sign Ace of Base";
    }  
    var spotify = new Spotify ({
        id: 'b48b1f7130c84db1b3a3c9a11fc8ca7b',
        secret: 'd93d7c864679474b90554238b5b3640b'    
    });
    spotify.search({ type: 'track', query: songName}, function(error, data){
        if (error) {
            if (!data) {
                return showSong("The Sign Ace of Base");
            }
            return console.log('Error occurred: ' + error);
        }
        console.log("Track Title: " + data.tracks.items[0].name);
        console.log("Artist name: " + data.tracks.items[0].artists[0].name);
        console.log("From Album: " + data.tracks.items[0].album.name);
        console.log("Preview Url: " + data.tracks.items[0].preview_url);
    });

// Code to accept command 'spotify-this-song'
    // [node liri.js spotify-this-song '<song name here>'] will show:
        // Artist(s)
        // The Song's name
        // A preview link of the song from Spotify
        // The album song is from
        // If no song is found the program will default to "The Sign" by Ace of Base
};      
function showMovie(movieName) {
request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName, function(error, response, body){
    // IMDB Rating of the movie.
    // * Rotten Tomatoes Rating of the movie.
    // * Country where the movie was produced.
    // * Language of the movie.
    // * Plot of the movie.
    // * Actors in the movie.
    var parsedData = JSON.parse(body);
    console.log("Movie Title: " + parsedData.Title);
    console.log("Year Released: " + parsedData.Year);
    console.log("IMDB Rating: " + parsedData.imdbRating);
    console.log("Rotten Tomatoes: " + parsedData.Ratings[1].Value);
    console.log("Country Produced: " + parsedData.Country);
    console.log("Language: " + parsedData.Language);
    console.log("Movie Plot: " + parsedData.Plot);
    console.log("Actors: " + parsedData.Actors);
    
    
});
// Code to accept command 'movie-this'
    // [node liri.js movie-this '<movie name here>']
};  

function showRandom(){
    // Code to accept command 'do-what-it-says'
    fs. readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        }
        var dataArr = data.split(",");
        main(dataArr[0], dataArr[1]);
    });
};
main(process.argv[2], process.argv[3]);