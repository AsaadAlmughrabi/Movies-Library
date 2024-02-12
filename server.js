"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { Client } = require("pg");
const url = `postgres://asaad:1234@localhost:5432/movies`;
const client = new Client(url);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("dotenv").config();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
let movieData = require("./Movie-Data/data.json");

//routes
app.get("/", homePageHandler);
app.get("/favorite", favoriteHandler);
app.get("/trending", trendingHandler);
app.get("/search", searchMovies);
app.get("/topRated", topRatedHandler);
app.get("/upcoming", upcomingHandler);
app.get("/similar", similarHandler);
app.post("/addMovie", addMovieHandler);
app.get("/getMovies", getMoviesHandler);
app.put("/UPDATE/:id", updateMovieHandler);
app.delete("/DELETE/:id", deleteMovieHandler);
app.get('/getMovie/:id', getMovie);
app.patch("/updateMovie/:id",updateOneMovieHandler)

//functions


//http://localhost:3000/addMovie
function addMovieHandler(req, res) {
  const { title, overview, release_date, poster_path, comments } = req.body;
  let sql = `INSERT INTO movie (title,overview,release_date,poster_path,comments)
VALUES($1,$2,$3,$4,$5) RETURNING *;`;
  const values = [title, overview, release_date, poster_path, comments];
  client
    .query(sql, values)
    .then((result) => res.status(201).json(result.rows))
    .catch((err) => {
      console.log(err);
      res.status(500).json("error saving data");
    });
}
//http://localhost:3000/getMovies
function getMoviesHandler(req, res) {
  const sql = "SELECT * FROM movie;";
  client
    .query(sql)
    .then((results) => {
      res.json(results.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error saving data");
    });
}

//http://localhost:3000/UPDATE/{movie_id}
function updateMovieHandler(req, res) {
  let movieId = req.params.id;
  const { title, overview, release_date, poster_path, comments } = req.body;
  let sql = `UPDATE movie
SET title = $1, overview = $2,release_date=$3, poster_path=$4, comments=$5 WHERE id=$6 RETURNING *`;
  let values = [title, overview, release_date, poster_path, comments, movieId];
  client
    .query(sql, values)
    .then((result) => {
      
      res.status(200).json({"Data updated successfully":result.rows})
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error during updating:");
    });
}
//http://localhost:3000/DELETE/{movie_id}
function deleteMovieHandler(req, res) {
  let id = req.params.id;
  let sql = `DELETE FROM movie WHERE id= $1;`;
  let values = [id];
 
  client
  .query(sql, values)
  .then(() => {
   res.send('Data deleted successfully')
    
  })
  .catch((error) => {
    console.error("Error during deletion:", error); // Log the error for inspection
    res.status(500).send("An error occurred while deleting data. Please check the server logs for more information.");
  });
}
//http://localhost:3000/getMovie/{movie_id}
function getMovie(req,res){
  let movieId=req.params.id;
  let sql= 'SELECT * FROM movie WHERE id=$1 ';
  let values=[movieId];
  client.query(sql,values).then(result=>{
    res.json(result.rows)
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send("Internal Server Error");
  });
}

//http://localhost:3000/updateMovie/{movie_id}/
function updateOneMovieHandler(req,res){
  let movieId=req.params.id;
  let {comments}=req.body;
  let sql=`UPDATE movie  SET comments=$1 WHERE id= $2 RETURNING *`;
  let values=[comments,movieId];
  client.query(sql,values).then(movie=>{
    res.json(movie.rows);
  }).catch((error) => {
    console.log(error);
    res.status(500).send("Internal Server Error");
  });
}


//http://localhost:8080/
function homePageHandler(req, res) {
  let movie = new Movies(
    movieData.title,
    movieData.poster_path,
    movieData.overview
  );
  res.json(movie);
}

//http://localhost:8080/favorit
function favoriteHandler(req, res) {
  res.send("Welcome to Favorite Page");
}

//http://localhost:8080/trending
function trendingHandler(req, res) {
  let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
  //axsios
  axios
    .get(url)
    .then((result) => {
      let trendingMOvies = result.data.results.map((movie) => {
        return new Trending(
          movie.id,
          movie.title,
          movie.release_date,
          movie.poster_path,
          movie.overview
        );
      });

      res.json(trendingMOvies);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
}

//http://localhost:8080/search?name=put the name here
function searchMovies(req, res) {
  let movieName = req.query.name;
  let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${apiKey}`;
  axios
    .get(url)
    .then((movie) => {
      let resultMovie = movie.data.results.map((element) => {
        return new Trending(
          element.id,
          element.title,
          element.release_date,
          element.poster_path,
          element.overview
        );
      });

      res.json(resultMovie);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
}
//http://localhost:8080/similar?name=put the name here
function similarHandler(req, res) {
  let movieName = req.query.name;

  let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${apiKey}`;
  axios
    .get(url)
    .then((movie) => {
      let resultMovie = movie.data.results[0].id;
      let url1 = `https://api.themoviedb.org/3/movie/${resultMovie}/similar?api_key=${apiKey}`;
      axios
        .get(url1)
        .then((response) => {
          res.json(response.data.results);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
}

//http://localhost:8080/upcoming?page=put the number of page
function upcomingHandler(req, res) {
  let numOfPage = req.query.page;
  let url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${numOfPage}&api_key=${apiKey}`;
  axios
    .get(url)
    .then((upcoming) => {
      let upcomingMovie = upcoming.data.results.map((movie) => {
        return new Trending(
          movie.id,
          movie.title,
          movie.release_date,
          movie.poster_path,
          movie.overview
        );
      });
      res.json(upcomingMovie);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
}

//http://localhost:8080/topRated?page=put any number of page
function topRatedHandler(req, res) {
  let numOfPage = req.query.page;
  let url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${numOfPage}&api_key=${apiKey}`;
  axios
    .get(url)
    .then((topRated) => {
      let tops = topRated.data.results.map((result) => {
        return new Trending(
          result.id,
          result.title,
          result.release_date,
          result.poster_path,
          result.overview
        );
      });
      res.json(tops);
    })

    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
}

//constructers
function Movies(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function Trending(id, title, release_date, poster_path, overview) {
  (this.id = id),
    (this.title = title),
    (this.release_date = release_date),
    (this.poster_path = poster_path),
    (this.overview = overview);
}

// 500 error handler
function handleServerError(err, req, res, next) {
  res.status(500);
  res.json({
    status: 500,
    responseText: "Sorry, something went wrong",
  });
}

//404 error handler
function handlerError(err, req, res, next) {
  res.status(404);
  res.json({
    status: 404,
    responseText: "Sorry, something went wrong",
  });
}

app.use(handlerError);
app.use(handleServerError);

client
  .connect()
  .then(() =>
    app.listen(port, () => {
      console.log(`server is running and  listening on port ${port}`);
    })
  )
  .catch((error) => {
    console.log(error);
    res.status(500).send("Internal Server Error");
  });
