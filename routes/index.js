var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*USER ADDED CODE*/
var mongoose = require('mongoose');
var Plat = mongoose.model('Plat');
var Dispo = mongoose.model('Dispo');
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

//returns a JSON object containing all plats
router.get('/plats', function(req, res, next) {
  Plat.find(function(err, plats){
    if(err){ return next(err); }

    res.json(plats);
  });
});

//Adds new plat
router.post('/plats',auth, function(req, res, next) {
  var plat = new Plat(req.body);
  plat.author = req.payload.username;
  plat.save(function(err, plat){
    if(err){ return next(err); }

    res.json(plat);
  });
});

//preloading plats
router.param('plat', function(req, res, next, id) {
  var query = Plat.findById(id);

  query.exec(function (err, plat){
    if (err) { return next(err); }
    if (!plat) { return next(new Error('can\'t find plat')); }

    req.plat = plat;
    return next();
  });
});

//returns single plat
router.get('/plats/:plat',function(req, res, next) {
  //populate() to retrieve comments along with posts:
  req.plat.populate('dispos', function(err, plat) {
    if (err) { return next(err); }

    res.json(plat);
  });
});

// delete the plat with this id
router.delete('/plats/:plat',function(req, res) {
  plat.remove({
    _id: req.params._id
  }, function(err, plat) {
    if (err)
      res.send(err);

    res.json({ message: 'Successfully deleted' });
  });
});

//create route for upvote plat
router.put('/plats/:plat/upvote',auth, function(req, res, next) {
  req.plat.upvote(function(err, plat){
    if (err) { return next(err); }

    res.json(plat);
  });
});

//Adds new dispo
router.post('/plats/:plat/dispos',auth, function(req, res, next) {
  var dispo = new Dispo(req.body);
  dispo.plat = req.plat;
  dispo.author = req.payload.username;
  dispo.save(function(err, dispo){
    if(err){ return next(err); }

    req.plat.dispos.push(dispo);
    req.plat.save(function(err, plat) {
      if(err){ return next(err); }

      res.json(dispo);
    });
  });
});

//route for register
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

//route for login + authentication user + token
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});
module.exports = router;
