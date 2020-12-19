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

app.post("/scrapme", jsonParser, (req, res)=>{

    var url = req.body.url;
    console.log("se busca en"+url);
    var descriptionContainer = req.body.description;
    var priceContainer = req.body.price;
    var priceU = req.body.Uprice ? req.body.Uprice : req.body.description ;
    var container = req.body.container;
    $result = puppeteer.launch({ executablePath: '/usr/bin/chromium-browser',args: [
        '--no-sandbox'
    ],headless: true}).then(async browser => {
        
        //opening a new page and navigating to Reddit
        const page = await browser.newPage ();
        await page.goto (url, { waitUntil: 'load',  timeout: 0});
        await page.waitForSelector (container).then(() => {
           
        }).catch(e => {
            return 'BUSQUEDA SIN RESULTADOS';
        });
    
        priceContainer =  req.body.price;
        descriptionContainer = req.body.description;
        priceU = req.body.Uprice !== "" ? req.body.Uprice : req.body.description ;
        container = req.body.container;
        var data = { "desc":descriptionContainer , "price":priceContainer , "container":container , "priceU":priceU };
        //manipulating the page's content
        let grabPosts = await page.evaluate (data => {
        let allPosts = document.body.querySelectorAll(data.container);
        //storing the post items in an array then selecting for retrieving content
        scrapeItems = [];
        allPosts.forEach (item => {

        let postTitle = "";
        let postDescription = '';
        let priceUnit = "";
        try {
            postTitle = item.querySelector(data.desc).innerText;
            postDescription = item.querySelector(data.price).innerText;
            priceUnit = item.querySelector(data.priceU).innerText;

        } catch (err) {}


            scrapeItems.push ({
            descripcion: postTitle,
            precio: postDescription,
            precioU: priceUnit
            });
        });
        let items = {
            0: scrapeItems,
        };
        
        return items;
        },data)
        //outputting the scraped data
        await browser.close();
        console.log (grabPosts);
        res.json(grabPosts)

        //closing the browser
    
  }).catch(
        
        console.log("err")
    ) 
  

});

app.post("/laeconomia/scrapping", jsonParser, (req, res)=>{

    var url = req.body.url;
    console.log("se busca en"+url);
    var descriptionContainer = req.body.description;
    var priceContainer = req.body.price;
    var priceU = req.body.Uprice ? req.body.Uprice : req.body.description ;
    var container = req.body.container;
        
    $result = puppeteer.launch({args: [
        '--no-sandbox'
    ],headless: true}).then(async browser => {

        //opening a new page and navigating to Reddit  77 
        const page = await browser.newPage ();
        await page.goto (url, { waitUntil: 'load',  timeout: 600000});
        await page.waitForSelector(".modal-body").then(async () => {
            await page.select('select[name="select"]', "11001").then(() => { }).catch(e => {  });
        }).catch(e => { return 'BUSQUEDA SIN RESULTADOS'; });

        await page.waitForSelector(container).then(() => {   
        }).catch(e => {
            return 'BUSQUEDA SIN RESULTADOS';
        });
        
        //await page.waitForSelector (container);
        priceContainer =  req.body.price;
        descriptionContainer = req.body.description;
        priceU = req.body.Uprice !== "" ? req.body.Uprice : req.body.description ;
        container = req.body.container;
        var data = { "desc":descriptionContainer , "price":priceContainer , "container":container , "priceU":priceU };
        console.log(data)
        //manipulating the page's content
        try {
            
        var grabPosts = await page.evaluate (data => {
            let allPosts = document.body.querySelectorAll(data.container);
            //storing the post items in an array then selecting for retrieving content
            scrapeItems = [];
            allPosts.forEach (item => {
                console.log(data.desc)
                let postTitle = "";
                let postDescription = '';
                let priceUnit = "";
                try {
                    postTitle = item.querySelector(data.desc).getAttribute("title");
                    postDescription = item.querySelector(data.price).innerText;
                    priceUnit = item.querySelector(data.priceU).innerText;

                } catch (err) {}

                scrapeItems.push ({
                descripcion: postTitle,
                precio: postDescription,
                precioU: priceUnit
                });
            });
            let items = {
                0: scrapeItems,
            };

            return items;
        },data).then(() => {   
        }).catch(e => {
            return 'BUSQUEDA SIN RESULTADOS';
        });
    } catch (error) {
        await browser.close();
        return "BUSQUEDA SIN RESULTADOS";
    }
        //outputting the scraped data
        await browser.close();
        res.json(grabPosts)

        //closing the browser

  }).catch(
        console.log("err")
    )

});

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
module.exports = app;
