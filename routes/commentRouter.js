const express = require('express');
const cors = require('./cors');
const bodyParser = require('body-parser');
const commentRouter = express.Router();
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const Comments = require('../models/comments');
const authenticate = require('../authenticate');

var getComment = function(req,res,next){
  Comments.findById(req.params.commentId)
  .populate('author')
  .then((comment) => {
    if(comment!= null){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      req.comment = comment;
      next()
    }else{
      err = new Error('Comment '+req.params.commentId + " not found");
      res.status = 404;
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

// .options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
commentRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors,(req,res,next) => {
    // console.log('comments',Comments,Dishes,'Done');
    Comments.find({})
    .populate('author')
    .then((comments) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    if(req.body != null){
      req.body.author = req.user;
      console.log(req.body);
      Comments.create(req.body)
      .then((comment) => {
        console.log('err in creation')
        Comments.findById(comment._id)
        .populate('author')
        .then((comment)=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(comment);
        })
      }, (err) => next(err))
      .catch((err) => next(err));
    }else{
      err = new Error('Comment not found in request body');
      err.status = 404;
      return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments/');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Comments.remove({})
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

//completed
commentRouter.route('/:commentId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors, getComment,(req,res,next) => {
    res.json(req.comment);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /comments/'+ req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,getComment,isOwner,(req, res, next) => {
  req.body.author = req.user._id;
  Comments.findByIdAndUpdate(req.comment._id,{$set:req.body},{new: true})
  .then((comment) => {
    Comments.findById(comment._id)
    .populate('author')
    .then((comment)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(comment);
    })
  })
  .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,getComment,isOwner,(req, res, next) => {
    Comments.findByIdAndRemove(req.comment._id)
    .then((comment)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(comment);
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports = commentRouter;
