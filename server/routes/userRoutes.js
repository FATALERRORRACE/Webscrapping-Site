const puppeteer = require ('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express");


const app = express();
const User = require("../models/userModel")
const bcrypt = require('bcrypt');
const underscore = require('underscore');
const Mongo_delete = require('mongoose-delete');
const bodyParser = require("body-parser");
const { object } = require("underscore");

const {verificar_token} = require('../middlewares/auth');

app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
    extended: true
  }));
  var jsonParser = bodyParser.json()

app.post("/qwe", jsonParser,(req, res)=>{

    var url = req.body.url;
    var descriptionContainer = req.body.description;
    var priceContainer = req.body.price;
    var container = req.body.container;
    
    $result = puppeteer.launch({ args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
    ],headless: false}).then(async browser => {
        
        //opening a new page and navigating to Reddit
        const page = await browser.newPage ();
        await page.goto (url, {waitUntil: 'load'});
        await page.waitForSelector ('.df-results');
        
        priceContainer =  req.body.price;
        descriptionContainer = req.body.description;
        container = req.body.container;
        var data = {"desc":descriptionContainer,"price":priceContainer, "container" : container };
        //manipulating the page's content
        let grabPosts = await page.evaluate (data => {
        let allPosts = document.body.querySelectorAll(data.container);
        //storing the post items in an array then selecting for retrieving content
        scrapeItems = [];
        allPosts.forEach (item => {
        let postTitle = item.querySelector(data.desc).innerText;
        let postDescription = '';
            try {
            postDescription = item.querySelector(data.price).innerText;
            } catch (err) {}
            scrapeItems.push ({
            postTitle: postTitle,
            postDescription: postDescription,
            });
        });
        let items = {
            "Info": scrapeItems,
        };
        
        return items;
        },data);
        //outputting the scraped data
        console.log (grabPosts);
        res.json(grabPosts)

        //closing the browser
    await browser.close();
  }).catch(console.log("err")) 
  

});


module.exports = app;