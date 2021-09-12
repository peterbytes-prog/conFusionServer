const http = require('http');
const express =require('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Promos = require('../models/promotions');

const app = express();
app.use(bodyParser.json());

promotionRouter.route('/')
.get((req,res,next) => {
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
.post(authenticate.verifyUser,(req, res, next) => {
  Promos.create(req.body)
  .then((promo)=>{
    console.log('Promo created',promo)
    res.statusCode = 200,
    res.setHeader('Content-Type','application/json');
    res.json(promo);
  },(err)=>{
    next(err)
  })
  .catch((err)=>next(err))
})
.put(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,(req, res, next) => {
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
.get((req,res,next) => {
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
.post(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})
.put(authenticate.verifyUser,(req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) => {
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
