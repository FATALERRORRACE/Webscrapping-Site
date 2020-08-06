const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const bodyParser =  require("body-parser");
const User = require("../models/userModel")

app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.post("/login", (req, res)=>{    
            
    let body = req.body;

    User.findOne({email : body.email},(err, user) => {
        if (err) res.json(err);
        if (user == null){ res.status(400).send("user not found").end()}  
        
        if(!bcrypt.compareSync( body.pass , user.password)) res.status(400).send("credential not valid");
        let token = Jwt.sign({
            user:body.email,
            user_role: user.role,
            status: "logged"
        },process.env.SEED,{expiresIn: process.env.TOKENEXPTIME });
        res.json({ok:true,
            usernasme:body.email,
            password:body.pass,
            token
        })
    
    });
});

module.exports = app;