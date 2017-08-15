var express = require('express');
var Twitter = require('twitter');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/latest-tweet', (req, res) => {

    // If undefined in our process load our local file
    // (i.e. we aren't on an external server where we set these differently)
    if(!process.env.twitter_consumer_key) {
      var env = require('./env.js')
    }

    var client = new Twitter({
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token_key: process.env.twitter_access_token_key,
      access_token_secret: process.env.twitter_access_token_secret
    });

    res.setHeader('Content-Type', 'application/json');

    // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
    client.get('statuses/user_timeline', { screen_name: process.env.twitter_username, count: 1 }, function(error, tweets, response) {
      if (!error) {

        var latestTweet = {
          text: tweets[0].text
        };


        res.send(JSON.stringify({ tweet: latestTweet }));
      }
      else {
        res.status(500).json({ error: error });
      }
    });

});

app.listen(app.get('port'));
