"use strict";

let express = require('express'),
    app = express(),
    session = require('express-session');
    
let bcrypt = require("bcrypt-nodejs");
let cookieParser = require('cookie-parser');
let path = require('path');
let util = require("util");

let jsonfile = require('jsonfile')
let users = require('./users.json');
let myfile = './users.json';


let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


app.set('port', (process.env.PORT))


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


let instructions = `
Visit these urls in the browser:
<ul>
  <li> <a href="http://localhost:8080/login">localhost:8080/login</a> </li>
  <li> <a href="http://localhost:8080/content">localhost:8080/content</a> </li>
  <li> <a href="http://localhost:8080/content/git.html">localhost:8080/content/git.html</a> </li>
  <li> <a href="http://localhost:8080/content/cloud9.html">localhost:8080/content/cloud9.html</a> </li>
  <li> <a href="http://localhost:8080/content/sessionsexpress.html">localhost:8080/content/sessionsexpress.html</a> </li>
  <li> <a href="http://localhost:8080/logout">localhost:8080/logout</a> </li>
</ul>
`;

let layout = function(x) { return x+"<br />\n"+instructions; };

app.use(cookieParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
app.use(function(req, res, next) {
  console.log("Cookies :  "+util.inspect(req.cookies));
  console.log("session :  "+util.inspect(req.session));
  next();
});

// Authentication and Authorization Middleware
let auth = function(req, res, next) {
  if (req.session && req.session.user in users)
    return next();
  else
    return res.sendStatus(401); // https://httpstatuses.com/401
};


app.get('/login', function(req, res){
  res.render('login');
});


app.post('/login', function(req, res){
  console.log(req.body);
  
  if (!req.body.username || !req.body.password) {
    console.log('login failed');
    res.send('login failed');    
  } 
  else if(req.body.username in users  && 
            bcrypt.compareSync(req.body.password, users[req.body.username])) {
    req.session.user = req.body.username;
    req.session.admin = true;
    res.send(layout("login success! user "+req.session.user));
  } 
  else {
    console.log(`login ${util.inspect(req.body)} failed`);    
    res.send(layout(`login ${util.inspect(req.body)} failed. You are ${req.session.user || 'not logged'}`));    
  }
});

 
app.get('/', function(req, res) {
  res.send(instructions);
});


app.get('/logout', function(req, res){
  req.session.destroy();
  res.render('logout');
});


// vista para cambiar de contraseña
app.get('/changepassword', function(req, res){
  res.render('changepassword');
});

app.post('/changepassword', function(req, res){
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    console.log('Datos invalidos');
    res.send('Datos invalidos');    
  } 
  else if(req.body.username in users) {
  
    users[req.body.username] = bcrypt.hashSync(req.body.password);
    jsonfile.writeFile(myfile, users, {spaces: 2},  function (err) {
      console.log(err);
    });
    
    res.send(layout("contraseña cambiada con exito"));
  }
  else {
    res.send(layout(`Usuario ${util.inspect(req.body.username)} o contraseña no valido.`));    
  }
});
 
// Get content endpoint
app.get('/content/*?', 
    auth  // next only if authenticated
);
 
app.use('/content', express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})