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


app.get("/qwe", async (req, res)=>{
    
    let url = req.query.url;
    let descriptionContainer = req.query.description;
    let priceContainer = req.query.price;
    $result = puppeteer.launch({ args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
    ],headless: false}).then(async browser => {
  
        //opening a new page and navigating to Reddit
        const page = await browser.newPage ();
        await page.goto (url, {waitUntil: 'load'});
        await page.waitForSelector ('.df-card');

        //manipulating the page's content
        let grabPosts = await page.evaluate (() => {
        let allPosts = document.body.querySelectorAll (descriptionContainer);
        
        //storing the post items in an array then selecting for retrieving content
        scrapeItems = [];
        allPosts.forEach (item => {
        let postTitle = item.querySelector (descriptionContainer).innerText;
        let postDescription = '';
            try {
            postDescription = item.querySelector (priceContainer).innerText;
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
        });
        //outputting the scraped data
        console.log (grabPosts);
        //closing the browser
    await browser.close();
  })
        res.send($result);

res.end();
});


module.exports = app;