const http = require("http");

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type':"application/json"});
    
    let salida = {
        nombre:"fernadnd",
        edad:123,
        url:req.url
    };
    res.write(JSON.stringify(salida));
    res.write("za warudo");

    res.end("za warudo");
})
.listen(8080);
console.log("listening 8088880");