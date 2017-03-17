# Sessions en ExpressJS


* **Autentificación**: Es el proceso por el cual se verifica que el usuario es quien él dice ser.
* **Autorización**: Es el proceso de determinar si el usuario tiene permisos para acceder a los datos o archivos que el ha solicitado.

A continuación se le mostrará un ejemplo muy sencillo de una autentificación y una autorización usando **session in express.js**. Hay un punto para loguearte y un punto para desloguearte y un método get que te muestra la página. Para ver la página publicada deberás estar logueado primero, además tu identidad será verificada y guardada en dicha sesión. Cuándo te desloguees de la página sucederá que: te rechazará el acceso borrando tu identidad de la sesión.

```js
var express = require('express'),
    app = express(),
    session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
 
// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});
 
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
 
// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});
 
app.listen(3000);
console.log("app running at http://localhost:3000");
```

Para probar el código pondríamos en la línea de comandos:

```bash
npm install express
npm install express-session
node session_auth.js &
```

Además tendríamos que visitar los siguientes urls en el navegador:

```html
localhost:3000/content
localhost:3000/login?username=amy&password=amyspassword
localhost:3000/content
localhost:3000/logout
localhost:3000/content
```

Se explicará brevemente el funcionamiento del código:

En este primer fragmento de código lo que se realiza es que se importan los módulos de **express** y **express-session**, se crea la aplicación de express y se añade la sesión a express como un **middleware**. 

```js
var express = require('express'),
    app = express(),
    session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
```

Aquí se realiza la función del **middleware** autentificación y autorización. El siguiente paso que realiza es mirar si el usuario es "amy" y si ella tiene permisos para verificarse. El valor para mirarlo esta hecho con el propósito de ser una demostración, en una aplicación web de verdad obtendría la autentificación y la autorización desde la sesión y lo compararía con una database que se encontraría en el servidor.


```js
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
```

A continuación mostramos lo que sería el [Query String](https://en.wikipedia.org/wiki/Query_string) del navegador para explicar los fragmentos de código:

**localhost:3000/login?username=amy&password=amyspassword** sería la URL que guardaría la autorización y verificación del usuario en la sesión. La sesión será diferente para cada usuario y única para el mismo usuario usando diferentes navegadores. Por ejemplo, si el mismo usuario se ha logueado usando Chrome, y se quiere loguear con Firefox el usuario deberá loguearse de nuevo en Firefox para obtener otra vez la protección adecuada. Una aplicación web real normalmente enviaría la solicitud y pasaría los datos por un formulario de envío. Aquí se ha hecho de forma que sirva para la demostración. La aplicación real miraría el usuario y su password en la database del servidor.

```js
// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});
```

Aquí se explica el punto de deslogueo utilizando el query string del navegador:

**localhost:3000/logout**, el deslogueo destruirá la sesión, es decir, borrará la identidad del usuario, por lo tanto si el usuario quiere volver a entrar deberá loguearse de nuevo para obtener la seguridad proporcionada.

```js
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
```


**localhost:3000/content**, es el query string que mostraría el contenido de la página web. La función de autorización es pasada en el segundo parámetro como un **middleware** antes de que se proceda a mostrar el contenido al usuario en cuestión. Si la función de autorización determina que el usuario no es válido no se pasará a la tecera función que es la que muestra el contenido al usuario.

```js
// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});
```

Por último dejaríamos la aplicación escuchando en el puerto *3000*.

```js
app.listen(3000);
console.log("app running at http://localhost:3000");
```