require("./../config/config.js");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

let connection = async () => {
  let connection = await mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  if(connection.Schema.reserved.on) console.log(); 
  return connection;
};

app.use(require("./routes/userRoutes.js"));

connection().then((mnsj)=>{
  if (mnsj) 
  console.log("database online");
}).catch((err)=>{
  if (err) throw err;
})

app.listen(process.env.PORT, ()=> console.log(`listening ${process.env.PORT}`));