require("./../config/config.js");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//endPoints
app.get("/usuarios/:id", (req, res)=>{
  //para declarar valores como parametro de la url se usa :parametro
  let id = req.params.id;
  let body = req.body;
  if(isNaN(id)) res.status(400, "falta id");
  res.end();
});

app.post("/usuarios", (req, res)=>{
  res.json("create user screen");
  res.end();
});

app.put("/usuarios", (req, res)=>{
  res.json("change user screen");
  res.end();
});

app.delete("/usuarios", (req, res)=>{
  res.json("delete  user screen");
  res.end();
});


app.get("/", (req, res)=>{
   res.write("api working");
   res.end();
});

app.listen(process.env.PORT, ()=> console.log(`listening ${process.env.PORT}`));