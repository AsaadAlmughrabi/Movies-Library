# Movies-Library -1.0

**Author Name**: Assad Almughrabi

## WRRC

![WRRC](./images/WRRC_DB.png)

## Overview

<p>It's a movies website that help you to watch what you need free without Ads</p>

## Getting Started

<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

### First we need to build the server following these steps:

- npm init -y -y : yes
- create index.js file , name is optional
- npm install express to install express package to use it
- run the server using node index.js
- require express framework
- invoke express
- specify port number
- run server make it liseting
- install dot env
- intall cors
- add routes
- send req from server to api using axios

#### Connect the server to database:
* prepare the database on your diveice and create it using Cmd CREATE TABLE
* psql dbName to enter your db
* create file .sql and create table
* install package  pg to connect node to postgres
* require pg and  create connection with {host, user, password, database}
* install  body parser for handling request body
* we added two routes  one for get data (movies) and another for post data (add movie).

## Project Features

<!-- What are the features included in you app -->
<p>the website will have many features like searech for a certain movies and see the top rated and upcoming movies</p>
