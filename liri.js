var keys = require('./keys.js'); //to access twitterKeys object in keys.js file
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs'); //required to read random.txt file

function main(command, search) {
  // main function will recognize commands given in the node/terminal command line &
  // then direct to appropriate functions passing through the command & search parameter (when necesary)
  switch (command) {
    case 'my-tweets': // = command
      showTweets();
      break;
    case 'spotify-this-song': // = command
      showSong(search); // note: passing in search parameter to showSong()
      break;
    case 'movie-this': // = command
      showMovie(search); // note: passing in search parameter to showMovie()
      break;
    case 'do-what-it-says': // = command
      showRandom();
      break;
    default:
      // = command to be performed if all prior = false
      showRandom();
      break;
  }
}

function showTweets() {
  var client = new Twitter(keys); // creating a new version of global variable Twitter w/ my account specific password keys
  var params = { screenName: 'rebbbeccao' }; //code accepting my username to log in to my account
  client.get('statuses/user_timeline', params, function(
    error,
    tweets,
    response
  ) {
    //code provided by twitter npm to request tweets for account specified
    if (!error) {
      //persorm code following if no error occurs
      for (var i = 0; i < tweets.length; i++) {
        //turns tweets retrieved into a for loop
        if (i >= 20) {
          break; // if the amount of tweets retrieved exceed 20 break the for loop
        }
        console.log(tweets[i].created_at); // finally provide specific info (date created/content) for the latest 20 tweets ([i])
        console.log('Tweet: ' + tweets[i].text);
      }
    }
  });
}

function showSong(songName) {
  //songName is now storing the passed parameter of search (see line 15)
  if (songName == undefined) {
    // if there is no songName variable/no search parameter entered into the node command line
    songName = 'Baby One More Time'; // default this songName variable/search parameter
  }
  var spotify = new Spotify({
    // code provided by node-spotify-api npm to access existing account
    id: 'b48b1f7130c84db1b3a3c9a11fc8ca7b',
    secret: 'd93d7c864679474b90554238b5b3640b'
  });
  spotify.search({ type: 'track', query: songName }, function(error, data) {
    //code provided by npm to request info note: songName variable has been passed in to specify search
    if (error) {
      //code to be performed if an error occurs
      if (!data) {
        // there is no data found upon request...
        return showSong('Baby One More Time'); //re-run function for shown songName variable value
      }
      return console.log('Error occurred: ' + error);
    }
    // display of specific returned values from retrieved data
    var data = {
      'Track Title': data.tracks.items[0].name,
      'Artist name': data.tracks.items[0].artists[0].name,
      'From Album': data.tracks.items[0].album.name,
      'Preview Url': data.tracks.items[0].preview_url
    };
    console.log(data);
    writeToTxt(data);
  });
}

function showMovie(movieName) {
  //code provided by omdb documentation w/ passed in search parameter value "movieName"
  if (movieName === undefined) {
    // if there is no movieName variable/no search parameter entered into the node command line
    movieName = 'Clueless'; // default this movieName variable/search parameter
  }
  //movieName is now storing the passed parameter of search (see line 18)
  request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName, function(
    error,
    response,
    body
  ) {
    if (error) {
      if (!data) {
        movieName = 'Clueless'; // default this movieName variable/search parameter if no data is found for search
      }
      return console.log('Error occurred: ' + error);
    }

    var parsedData = JSON.parse(body);
    console.log(parsedData);
    console.log('Movie Title: ' + parsedData.Title);
    console.log('Year Released: ' + parsedData.Year);
    console.log('IMDB Rating: ' + parsedData.imdbRating);
    // console.log("Rotten Tomatoes: " + parsedData.Ratings[1].Value);
    console.log('Country Produced: ' + parsedData.Country);
    console.log('Language: ' + parsedData.Language);
    console.log('Movie Plot: ' + parsedData.Plot);
    console.log('Actors: ' + parsedData.Actors);
  });
}

function writeToTxt(data) {
  fs.appendFile('random.txt', '/r/n/r/n', function(error) {
    if (error) {
      return console.log(error);
    }
  });

  fs.appendFile('random.txt', JSON.stringify(data), function(error) {
    if (error) {
      return console.log(error);
    } else {
      console.log('random.txt has been updated!');
    }
  });
}

function showRandom() {
  // reads random.txt file
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) {
      console.log(error);
    } // error catch
    var dataArr = data.split(','); // retrieves data from read file, splits value into an array at ","s, & stores new array into variable dataArr
    main(dataArr[0], dataArr[1]); // passes dataArr index values into the command/search parameters into the main();
  });
}
main(process.argv[2], process.argv[3]); // initial call of the main() with the corresponding process.argv indexes inputted into the command/search parameters
// this will be the first to run amongst the node liri.js call in the terminal command line
