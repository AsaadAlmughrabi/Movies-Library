const express = require("express");
const app = express();
const port = 3000;
let movieData = require("./Movie-Data/data.json");

function Movies(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

app.get("/", homePageHandler);

function homePageHandler(req, res) {
  let movie=new Movies(movieData.title,movieData.poster_path,movieData.overview);
  res.json(movie);
}

app.get("/favorite", favoriteHandler);
function favoriteHandler(req, res) {
  res.send("Welcome to Favorite Page");
}



app.use(function (err, req, res, next) {

  res.status(500);
  res.json({
    status: 500,
    responseText: "Sorry, something went wrong",
  });
});

app.use(function (req, res, next) {
  res.status(404);
  res.json({
    status: 404,
    responseText: "Sorry, the requested resource was not found",
  });
});

app.listen(port, () => {
  console.log(`server is running and  listening on port ${port}`);
});