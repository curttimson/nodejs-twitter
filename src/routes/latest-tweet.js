import express from 'express';

import Twitter from 'twitter';
import twitterText from 'twitter-text';

const router = express.Router();

router.get('/latest-tweet', (req, res) => {
  const client = new Twitter({
    consumer_key: process.env.twitter_consumer_key,
    consumer_secret: process.env.twitter_consumer_secret,
    access_token_key: process.env.twitter_access_token_key,
    access_token_secret: process.env.twitter_access_token_secret,
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  client.get('statuses/user_timeline', { screen_name: process.env.twitter_username, count: 100 }, (error, tweets) => {
    const formatTweet = (tweet) => ({
      text: tweet.text,
      html: twitterText.autoLink(twitterText.htmlEscape(tweet.text)),
    });

    if (!error) {
      res.send(JSON.stringify({ tweet: formatTweet(tweets[0]) }));
    } else {
      res.status(500).json({ error });
    }
  });
});

export default router;
