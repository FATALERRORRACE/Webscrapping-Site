const express = require("express");
const app = express();
const hbs = require('hbs');
const port = process.env.PORT || 3000;


app.use(express.static(__dirname+"/public"));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

app.get("/", (req, res)=>{

    res.render("home.hbs", {
      nombre:"fernando",
      texto:"no tanto texto"
    })  
})
app.get("/about", (req, res)=>{

    res.render("about.hbs", {
      nombre:"fernando",
      texto:"no tanto texto"
    })  
})


console.log(`listening ${port}`);
app.listen(port);