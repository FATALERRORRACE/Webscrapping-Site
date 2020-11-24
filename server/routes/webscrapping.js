const express = require("express");
const app = express();
const scrapeIt = require("scrape-it")
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const bodyParser =  require("body-parser");
const {OAuth2Client} = require('google-auth-library');
const User = require("../models/userModel")
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.get("api/webscrappingme", (req, res)=>{    
    res.send("hola");
    res.json(JSON.stringify("req.body"));
    req.url
    scrapeIt("https://www.farmalisto.com.co/#/dffullscreen/query=acetaminofen", {
    title: ".df-card__title",
    desc: ".df-card__price",
    
}).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    console.log(data)
})

});
module.exports = app;