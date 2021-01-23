//const http = require('http');
//const axios = require('axios');
//const HttpsProxyAgent = require('https-proxy-agent');
//const jwt = require('jsonwebtoken');
const { Pool, Client } = require('pg');
const path = require('path');
//const mysql = require('mysql');
const parser = require('body-parser');
const express = require('express');
const session = require('express-session');
const app = express();

//const server = http.createServer(app);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var portaccess = process.env.PORT || 8080;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.get('/', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/index.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/programs', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/programs/index.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/programs/csharp', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/programs/csharp/index.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/programs/csharp/lesson-6', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/programs/csharp/lesson-6.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/programs/csharp/lesson-7', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/programs/csharp/lesson-7.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/tools', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/tools/index.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/tools/gdrive-linkgen', function(req,res) {
  if (req.session.loggedin) {
    res.sendFile('/tools/gdrive-linkgen.html', {root: __dirname});
  } else {
    res.redirect('/auth/login');
  }
});

app.get('/auth/login', function(req,res) {
  res.sendFile('/login.html', {root: __dirname});
});

app.post('/auth/login', function(req,res) {
  var uname = req.body.uname;
  var pword = req.body.pword;

  if (uname && pword) {
    pool
      .connect()
      .then(client => {
        return client
          .query('SELECT uname FROM users.auth where uname = $1 and pword = $2', [uname, pword])
          .then(resu => {
            client.release()
            console.log(resu.rows[0])
            req.session.loggedin = true;
            req.session.username = uname;
            res.redirect('/');
          })
          .catch(err => {
            client.release()
            res.send(err.stack)
          })
    })
  } else {
    response.send('Please enter username and/or password!');
		response.end();
  }
});

app.listen(portaccess);

/*
app.get('/t', function(req,res){
  var q = req.query.q;
  var token = jwt.sign({videoId: q}, prv, {expiresIn: '3hr', algorithm: 'RS256'});
  res.send(token);
});

function getToken(q){
  return jwt.sign({videoId: q}, prv, {expiresIn: '3hr', algorithm: 'RS256'});
};

app.get('/vt', function(req,res){
  var q = req.query.q;
  jwt.verify(q, pub, function (err, dec){
    if(err) res.send('Invalid token!');
    else res.send('True');
  });
});
*/
