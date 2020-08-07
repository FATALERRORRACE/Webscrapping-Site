/* 
 PORT
 */
process.env.PORT = process.env.PORT || 3000;

/* 
 DB CONNECTION
 */
process.env.NODE_ENV =(process.env.NODE_ENV == "production") ? "production" : "false";

process.env.CLIENT_ID = "556317819298-grurjq52gbfq023ri0i2ahrveomr3b1a.apps.googleusercontent.com";

process.env.TOKENEXPTIME = 60 * 60 * 24 * 30;
process.env.SEED = "es-un_Secretooo";

let urlMongo = process.env.MONGO_PROD;

if(process.env.NODE_ENV === "false"){
    urlMongo = "mongodb+srv://SudoN0id:1997Bravo_@pablocluster.o9ynh.gcp.mongodb.net/test";
}
process.env.URLDB = urlMongo;