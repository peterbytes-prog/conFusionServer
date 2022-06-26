const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000','https://localhost:3443','http://Peters-MacBook.local:3000','http://192.168.1.73:3006','http://localhost:3006', 'http://localhost:3001', 'http://192.168.1.73:3001',];

var corsOptionsDelegate = (req,callback) =>{

  console.log(req.header('Origin'))
  var corsOptions = { origin:true };//default cors access to all header is false
  if(whitelist.indexOf(req.header('Origin'))!== -1){
    corsOptions={ origin:true }
  }
  callback(null,corsOptions);
}

exports.cors = cors({credentials: true, origin: true});
exports.corsWithOptions = cors({credentials: true, origin: true});
