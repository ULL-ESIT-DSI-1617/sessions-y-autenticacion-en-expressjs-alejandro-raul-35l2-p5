# Cookies

Las Cookies son pequeñas cantidades de datos que se envían desde el sitio web y son almacenadas en el navegador web del usuario mientras el usuario está navegando en ese sitio web. Cada vez que el usuario carga dicha página de nuevo, el navegador envía los datos que almacenó a la página web o servidor, para distinguir la actividad previa del usuario.

Lo primero que habría que hacer para utilizar las cookies es instalar un middleware cookie-parser mediante **_npm_**.

```js    
npm install cookie-parser
```

## Usar Cookie-Parser

Hay que importar **_cookie-parser_** en la aplicación:

```js
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
```

## Sintaxis

Cookie-Parser analiza la cabecera de la Cookie y establece **_req.cookie_** con un objeto introducido por los nombres de las cookies. Para establecer una nueva cookie hay que definir una nueva ruta en la aplicación de express:


```js
app.get('/cookie',function(req, res){
     res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
});
```

Para comprobar que la cookie se ha establecido, hay que ir a la consola del navegador y escribir **_document.cookie_**.

El navegador envía la cookie al servidor, cada vez que se solicita esa página. Para obtener una cookie que un navegador podría estar enviando al servidor adjuntándolo a la cabecera de la petición:

```js
app.get('/', function(req, res) {
  console.log("Cookies :  ", req.cookies);
});
```

## Establecer la Cookie de tiempo de espera

Para establecer dicha cookie basta con lo siguiente:

```js
res.cookie(name, 'value', {expire : new Date() + 9999});
```

Se pueden establecer opciones adicionales para cookies pasando un objeto como argumento, el cual lleva los ajustes adicionales para cookies. Así que para establecer el tiempo de expiración de la cookie, se puede enviar un objeto con la propiedad de expiración, que contiene el tiempo en milisegundos.

Otra forma de establcer la expiración de la cookie es usar la propiedad opcional **_magAge_**.

```js
res.cookie(name, 'value', {masAge : 9999});
```

## Eliminar la cookie existente

Una cookie existente se puede eliminar fácilmente usando el método **_clearCookie_** que acepta el nombre de la cookie que se quiere eliminar.

```js
app.get('/clearcookie', function(req,res){
     clearCookie('cookie_name');
     res.send('Cookie deleted');
});
```

Una vez hecho esto se puede comprobar en la consola del navegador que dicha cookie se ha eliminado.