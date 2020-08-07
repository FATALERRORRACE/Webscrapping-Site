const express = require("express");
const app = express();
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

app.post("/googlesignin",async(req, res)=>{
    
    let token = req.body.token; 
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    console.log(ticket.getPayload());
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    User.findOne({email:payload.email},(err, userfound)=>{
        if(err) throw err;
        if(userfound == null) res.status(404).json({message:"user not registered",error: 404}).end();
        res.json(userfound);
        res.end()
    })
})
module.exports = app;