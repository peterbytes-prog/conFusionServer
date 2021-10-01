const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000','https://localhost:3443','http://Peters-MacBook.local:3000','http://192.168.1.73:3006','http://localhost:3006'];
var corsOptionsDelegate = (req,callback) =>{
  var corsOptions = { origin:false };//default cors access to all header is false
  if(whitelist.indexOf(req.header('Origin'))!== -1){
    corsOptions={ origin:true }
  }
  callback(null,corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
