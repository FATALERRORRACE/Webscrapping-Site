const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const Mongo_delete = require('mongoose-delete');



let user = new Schema({
    name:{
        type: String,
        required: [true, "please insert your name"]
    },
    email:{
        type: String,
        unique:true,
        required: [true,"please inset your email"]
    },
    password:{
        type: String,
        required: [true, "please insert, you know an pass"]
    },
    img:{
        type:String,required:false
    },
    role:{
        type:String,required:false
    },
    state:{
        type:Boolean,required:true
    },
    google:{
        type:Boolean,required:false
    }
});
user.methods.toJSON = function (){
    let user = this;
    let userOBJ = user.toObject();
    delete userOBJ.password
    return userOBJ;
};

user.plugin(Mongo_delete, { overrideMethods: 'all' , indexFields: 'all'});
user.plugin(uniqueValidator,{  message: 'Error, expected {PATH} already exists.' });

module.exports = mongoose.model("User", user);