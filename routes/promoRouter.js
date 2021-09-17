const http = require('http');
const express =require('express');
const cors = require('./cors');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Promos = require('../models/promotions');

const app = express();
app.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next) => {
  Promos.find({})
  .then((promos)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promos);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Promos.create(req.body)
  .then((promo)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promo);
  },(err)=>{
    next(err)
  })
  .catch((err)=>next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Promos.remove({})
  .then((promos)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promos);
  },(err)=>{
    next(err)
  })
  .catch((err)=>next(err))
});


promotionRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors, (req,res,next) => {
  Promos.findById(req.params.promotionId)
  .then((promo)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promo);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Promos.findByIdAndUpdate(req.params.promotionId,
    {$set:req.body},
    {new:true})
  .then((promo)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promo);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Promos.findByIdAndRemove(req.params.promotionId)
  .then((promo)=>{
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promo);
  },(err)=>{
    next(err);
  })
  .catch((err)=>next(err))
});

module.exports = promotionRouter;
