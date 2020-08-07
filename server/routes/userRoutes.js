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

app.get("/usuarios/:id", verificar_token, (req, res)=>{
    //para declarar valores como parametro de la url se usa :parametro
    let id = req.params.id;
    let body = req.body;
    if(isNaN(id)) res.status(400, "falta id");
    res.end();
});
  
app.post("/usuarios", verificar_token, async (req, res)=>{
    
    if(req.user.user_role != "admin") res.status(401).json({role: req.user.user_role ,error: "only admin can add users"})
    
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,2),
        img: req.body.img,
        role: req.body.role,
        state: req.body.state,
        google: req.body.google,
    });


    let result = await user.save().then((mnsj)=>{
        res.json(mnsj);
    }).catch((err)=>{
        res.json(err);
    });

    console.log(result)

    res.end();
});
  
app.put("/usuarios/:id", verificar_token, async (req, res)=>{

    if(req.user.user_role != "admin") res.status(401).json({role: req.user.user_role ,error: "only admin can add users"})

    let body = req.body; // ACA 
    body = underscore.omit(body,["password","google"]);
    let user = await User.findByIdAndUpdate(req.params.id, body, {new:true, runValidators:true}, (err, userFound) => {
        
    });

    res.json(body);
    res.end();
});
  
app.delete("/usuarios/:id", verificar_token, (req, res)=>{

    if(req.user.user_role != "admin") res.status(401).json({role: req.user.user_role ,error: "only admin can add users"})

    let id = req.params.id;
    
    let user = User.deleteById(id,{},(err,delet)=>{
        res.json(delet);
    });
    res.end();
});
  
/*app.get("/", (req, res)=>{
    res.write("welcome to my api :)")    
    res.end();
});*/

// paginación
app.get("/usuarios", verificar_token, async (req, res)=>{

    let result = [];

    let from = Number(req.query.from) || 0 ;
    let limit = Number(req.query.limit) || 5 ;
    let user = await User
    .find({deleted:true},"name email")
    .skip(from)
    .limit(limit)   
    .exec((err, data)=>{
        if (err) throw err;
      
            res.json({data, count: Object.keys(data).length ,jwtData:  req.user});
        
    })
 
});

module.exports = app;