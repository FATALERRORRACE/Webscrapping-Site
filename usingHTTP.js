const http = require("http");

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type':"application/json"});
    
    let salida = {
        nombre:"REST",
        edad:0000,
        url:req.url
    };
    res.write(JSON.stringify(salida));
    
})
.listen(8080);
console.log("listening 8088880");