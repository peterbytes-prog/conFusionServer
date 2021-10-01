const http = require('http');
const express = require('express');
const cors = require('./cors');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Leaders = require('../models/leaders');

const app = express();
app.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors, (req,res,next) => {
    Leaders.find(req.query)
    .then((leaders)=>{
      res.statusCode = 200,
      res.setHeader('Content-Type','application/json');
      res.json(leaders);
    },(err)=>{
      next(err);
    })
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   Leaders.create(req.body)
   .then((leader)=>{
     res.statusCode = 200,
     res.setHeader('Content-Type','application/json');
     res.json(leader);
   },(err)=>{
     next(err)
   })
   .catch((err)=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Leaders.remove({})
  .then((leader)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(leader);
  },(err)=>{
    next(err)
  })
  .catch((err)=>next(err))
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next) => {
  Leaders.findById(req.params.leaderId)
  .then((leader)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(leader);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Leaders.findByIdAndUpdate(req.params.leaderId,
    {$set:req.body},
    {new:true})
  .then((leader)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(leader);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Leaders.findByIdAndRemove(req.params.leaderId)
  .then((leader)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(leader);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
});
module.exports = leaderRouter;
