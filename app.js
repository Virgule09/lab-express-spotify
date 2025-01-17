require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get("/", (req, res) => {
    res.render('home.hbs');
});

app.get("/artist-search", (req,res) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        // console.log('The received data from the API: ', data.body.artists.items);
        res.render('artist-search-results', data.body.artists);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId) 
    .then(
        function(data) {
          console.log('Artist albums', data.body);
          res.render('albums', data.body);
        },
        function(err) {
          console.error(err);
        }
      );
})

app.get('/track-information/:albumId', (req,res) => {
    spotifyApi.getAlbumTracks('req.params.albumId', { limit : 5, offset : 1 })
  .then(
    function(data) {
    console.log(data.body);
    res.render('track-information', data.body);
  }, 
  function(err) {
    console.log('Something went wrong!', err);
  }
  );
});

app.listen(3002, () => console.log('My Spotify project running on port 3002 🎧 🥁 🎸 🔊'));
 
