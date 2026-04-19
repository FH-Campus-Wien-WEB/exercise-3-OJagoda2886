const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/

app.get('/genres', function (req, res) {
  let movies = Object.values(movieModel)
  let genres = [] 
  
  for (let movie of movies) {
    genres = genres.concat(movie["Genres"]);
    }
  
  const unique = [...new Set(genres)];
  unique.sort()
  res.send(unique)
})

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre

   But it could be done in loadmovies function too
 */
app.get('/movies', function (req, res) {
  const genre = req.query.genre;
  let movies = Object.values(movieModel)
  let finalmovies = []
  for (const movie of movies) {
    //The first one is if genre is missing or empty
    if (!genre || genre === "All" || movie.Genres.includes(genre)) {
      finalmovies.push(movie)
    }
  }
  res.send(finalmovies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
