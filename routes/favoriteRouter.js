const express = require('express');
const bodyParser = require('body-parser');
const favoriteRouter = express.Router();
const cors = require('./cors');
const app = express();
app.use(bodyParser.json());
const mongoose = require('mongoose');
var Favorites = require('../models/favorite');
const authenticate = require('../authenticate');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors,authenticate.verifyUser, (req,res,next)=>{
  Favorites.findOne({user:req.user})
  .populate('dishes')
  .then((favs)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(favs);
  },(err)=>next(err))
  .catch((err)=>next())
})
.post(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({user:req.user})
  .then((favIns)=>{

    if(favIns!==null){
      console.log('not null');
      for (let val of req.body){
        console.log(val._id);
        favIns.dishes.push(val._id);
      }
      favIns.save()
      .then((fav)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(fav);
      },(err)=>next(err))
      .catch((err)=>next(err))
    }else{
      console.log('null');
      Favorites.create({user:req.user})
      .then((fav)=>{
        for (let val of req.body){
          console.log(val._id);
          fav.dishes.push(val._id);
        }
        fav.save()
        .then((fav)=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(fav);
        },(err)=>{
          next(err);
        })
        .catch((err)=>next(err))
      },(err)=>next(err))
      .catch((err)=>next(err))
    }
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.put(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  //not allow
  res.statusCode = 403;
  res.end('PUT operation not supported on /users/favourites/');
})
.delete(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({user:req.user}).remove()
  .then((favs)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(favs);
  },(err)=>next(err))
  .catch((err)=>next(err))
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res)=>{ res.sendStatus(200) })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  //not allow
  res.statusCode = 403;
  res.end('Get operation not supported on /users/favourites/'+req.params.dishId);
})
.post(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  //no need to populate res
  Favorites.findOne({user:req.user})
  .then((favIns)=>{
    if(favIns!==null){
      console.log('not null');
      favIns.dishes.push(req.params.dishId);
      favIns.save()
      .then((fav)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(fav);
      },(err)=>next(err))
      .catch((err)=>next(err))
    }else{
      console.log('null');
      Favorites.create({user:req.user})
      .then((fav)=>{
        fav.dishes.push(req.params.dishId);
        fav.save()
        .then((fav)=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(fav);
        },(err)=>{
          next(err);
        })
        .catch((err)=>next(err))
      },(err)=>next(err))
      .catch((err)=>next(err))
    }
  },(err)=>next(err))
  .catch((err)=>next(err));
})
.put(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  //not allow
  res.statusCode = 403;
  res.end('Put operation not supported on /users/favourites/'+req.params.dishId);
})
.delete(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  //delete a specific dish
  //no need to populate res
  Favorites.findOne({user:req.user})
  .then((favIns)=>{
    favIns.dishes.remove(req.params.dishId);
    favIns.save()
    .then((fav)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(fav);
    },(err)=>{
      next(err);
    })
    .catch((err)=>next(err))
  },(err)=>next(err))
  .catch((err)=>{
    next(err);
  })

});
module.exports = favoriteRouter;
