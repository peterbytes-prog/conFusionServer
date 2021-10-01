const express = require('express');
const cors = require('./cors');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

var getComment = function(req,res,next){
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          req.comment = dish.comments.id(req.params.commentId)
          next()
      }
      else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
}
var isOwner = function(req,res,next){
  if (req.comment.author.id !== req.user.id){
    var err = new Error('You are not authorized to perform this operation!');
    req.comment = null;
    err.status = 403;
    next(err);
  }
  return next()
}

dishRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors, (req,res,next) => {
    Dishes.find(req.query)
      .populate('comments.author')
      .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err))
      .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
 Dishes.create(req.body)
  .then((dish)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.remove({})
      .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      },(err)=>next(err))
      .catch((err)=>next(err));
});


dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next) => {
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set:req.body
  },{new:true}).then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=>next(err));
});


module.exports = dishRouter;
