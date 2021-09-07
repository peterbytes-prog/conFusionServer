const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
      .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err))
      .catch((err)=>next(err));
})
.post((req, res, next) => {
 console.log('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
 Dishes.create(req.body)
  .then((dish)=>{
    console.log('Dish created',dish)
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
      .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      },(err)=>next(err))
      .catch((err)=>next(err));
});


dishRouter.route('/:dishId')
.get((req,res,next) => {
  Dishes.findById(req.params.dishId)
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set:req.body
  },{new:true}).then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.delete( (req, res, next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=>next(err));
});

module.exports = dishRouter;
