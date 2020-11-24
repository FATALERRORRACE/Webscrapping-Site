require("./../config/config.js");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// middlewares //
app.use(require("./routes/index.js"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use( express.static( path.resolve(__dirname , "../public")));

let connection = async () => {
  let connection = await mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  if(connection.Schema.reserved.on) console.log(); 
  return connection;
};



connection().then((mnsj)=>{
  if (mnsj) 
  console.log("database online");
}).catch((err)=>{
  if (err) throw err;
})

app.listen(process.env.PORT, ()=> console.log(`listening ${process.env.PORT}`));