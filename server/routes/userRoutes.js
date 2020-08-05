const express = require("express");
const app = express();
const User = require("../models/userModel")
const bcrypt = require('bcrypt');
const underscore = require('underscore');
const Mongo_delete = require('mongoose-delete');
const { object } = require("underscore");


app.get("/usuarios/:id", (req, res)=>{
    //para declarar valores como parametro de la url se usa :parametro
    let id = req.params.id;
    let body = req.body;
    if(isNaN(id)) res.status(400, "falta id");
    res.end();
});
  
app.post("/usuarios", async (req, res)=>{
    
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
  
app.put("/usuarios/:id",async (req, res)=>{

    let body = req.body; // ACA 
    body = underscore.omit(body,["password","google"]);
    let user = await User.findByIdAndUpdate(req.params.id, body, {new:true, runValidators:true}, (err, userFound) => {
        
    });

    res.json(body);
    res.end();
});
  
app.delete("/usuarios/:id", (req, res)=>{
    let id = req.params.id;
    
    let body = {deleteAt:Date.now(), deleted:true};
    
    let user = User.deleteById(id,{},(err,delet)=>{
        res.json(delet);

    });
    //User.softDelete(id, (err, user) =>{
    //    if (err) res.status(400).json({resume:"the user cannot be found or already deleted"});
    //    res.json({ok:true,user}) 
    //});
    

});
  
app.get("/", (req, res)=>{
    User.find({deleted:tr});
});

// paginación
app.get("/usuarios", async (req, res)=>{

    let result = [];

    let from = Number(req.query.from) || 0 ;
    let limit = Number(req.query.limit) || 5 ;
    let user = await User
    .find({deleted:true},"name email")
    .skip(from)
    .limit(limit)   
    .exec((err, data)=>{
        if (err) throw err;
      
            res.json({data, count: Object.keys(data).length });
        
    })
 
});

module.exports = app;