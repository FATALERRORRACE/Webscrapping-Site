/* 
 PORT
 */
process.env.PORT = process.env.PORT || 3000;

/* 
 DB CONNECTION
 */
process.env.NODE_ENV =(process.env.NODE_ENV == "production") ? "production" : "false";

let urlMongo = "mongodb+srv://SudoN0id:1997Bravo_@pablocluster.o9ynh.gcp.mongodb.net/test";

if(process.env.NODE_ENV === "false"){
    urlMongo = "mongodb://localhost:27017/DBtest";
}
process.env.URLDB = urlMongo;