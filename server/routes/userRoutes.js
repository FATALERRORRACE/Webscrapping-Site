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
app.post("/takescreenshot", jsonParser, (req, res)=>{

    let url = req.body.url;
    //let path_to_save = req.body.path;
    let fileName = req.body.fileName;
    var token = "";

    // ------------ get token 
    // http://drovancal.waplicaciones.co//login_check
    axios.post('http://drovancal.waplicaciones.co/api/login_check', {
    username: "1032358719",
    password: "a"
  })
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res.data.token)
    token = res.data.token;
  })
  .catch(error => {
    console.error(error)
  })
    // ------------ end get token 
    $result = puppeteer.launch({ executablePath: '/usr/bin/chromium-browser',args: [
        '--no-sandbox'
    ],headless: true}).then(async browser => {
        
        //opening a new page and navigating to Reddit   
        const page = await browser.newPage ();

        page.setExtraHTTPHeaders({
            'Authorization': "Bearer "+token,
        });
        await page.goto ("http://drovancal.waplicaciones.co/api/rutas_puntos?origin=api&idRuta=21", { waitUntil: "domcontentloaded" ,  timeout: 0});
        await page.waitForSelector (".gm-style-pbt").then(() => {
        }).catch(e => {
            return 'BUSQUEDA SIN RESULTADOS';
        });
        //await delay(4000);
        let response = await page.screenshot({
            //path: path_to_save+name,
            type:"jpeg",
            clip:{
                x:10,
                y:120,
                width:370,
                height: 460
            },
            encoding: "base64"
        }).then((string, buffer)=>{
            console.log(string);
            return string;
        })
        res.send(response);
        await browser.close();

    }).catch(
    ) 
});
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
module.exports = app;
