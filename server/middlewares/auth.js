const json = require('body-parser/lib/types/json');
const Jwt = require('jsonwebtoken');


let verificar_token = (req, res, next ) => {
    let token = req.get("token");
    Jwt.verify(token,process.env.SEED, (err,decoded) =>{
        if(err) res.status(401).send("invalid token");
        req.user = decoded;
        next();
    })

}

module.exports = { verificar_token };