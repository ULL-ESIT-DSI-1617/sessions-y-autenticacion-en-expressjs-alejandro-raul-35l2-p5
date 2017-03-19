"use strict";

let bcrypt = require('bcrypt-nodejs');
let jsonfile = require('jsonfile')
let myfile = './users.json';



let users = {
    pedro : bcrypt.hashSync("pedropassword"),
    juan : bcrypt.hashSync("juanpassword"),
    amy : bcrypt.hashSync("amypassword")
};

jsonfile.writeFile(myfile, users, {spaces: 2}, function(err) {
  console.error(err)
})

