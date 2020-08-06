/* 
 PORT
 */
process.env.PORT = process.env.PORT || 3000;

/* 
 DB CONNECTION
 */
process.env.NODE_ENV =(process.env.NODE_ENV == "production") ? "production" : "false";

let urlMongo = process.env.MONGO_PROD;

if(process.env.NODE_ENV === "false"){
    urlMongo = "mongodb://localhost:27017/DBtest";
}
process.env.URLDB = urlMongo;