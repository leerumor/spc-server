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
var Precmd = mongoose.model('Precmd');
//var Reservation = mongoose.model('Reservation');
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
router.post('/plats', function(req, res, next) {
  var plat = new Plat(req.body);
  //plat.author = req.payload.username;
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
  //populate() to retrieve comments along with plats:
  req.plat.populate('dispos', function(err, plat) {
    if (err) { return next(err); }

    res.json(plat);
  });
});

// delete the plat with this id
router.delete('/plats/:plat',function(req, res) {

  Dispo.remove({
    plat: new mongoose.Types.ObjectId(req.params.plat)
  }, function(err){
    if(err) throw err;
  });
  Plat.remove({
    _id: req.params.plat
  }, function(err, plat) {
    if (err)
      res.send(err);

    res.json({ message: 'Successfully deleted' });
  });
});

//create route for upvote plat
router.put('/plats/:plat/upvote', function(req, res, next) {
  req.plat.upvote(function(err, plat){
    if (err) { return next(err); }

    res.json(plat);
  });
});

//Adds new dispo
router.post('/plats/:plat/dispos', function(req, res, next) {
  var dispo = new Dispo(req.body);
  dispo.plat = req.plat;
  dispo.save(function(err, dispo){
    if(err){ return next(err); }

    req.plat.dispos.push(dispo);
    req.plat.save(function(err, plat) {
      if(err){ return next(err); }

      res.json(dispo);
    });
  });
});

//remove dispo
router.delete('/plats/:plat/dispos/:dispo',function(req, res) {
  Dispo.remove({
    _id: req.params.dispo
  }, function(err, dispo) {
    if (err)
      res.send(err);

    res.json({ message: 'Successfully deleted' });
  });
});

//route for register
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
  /*
  // pour éviter les nom répétés
  var query = User.findOne({username:req.body.username});
  query.exec(function (err, olduser){
    if (err) { return next(err); }
    return res.status(400).json({ message: "Nom d'utilisateur existe!" });
  });*/

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

//returns a JSON object containing all precmds
router.get('/precmds', function(req, res, next) {
  Precmd.find(function(err, precmds){
    if(err){ return next(err); }

    precmds.forEach(function(precmd){
      precmd.populate('reservations', function(err, precmd) {
        if (err) { return next(err); }
        //still the same after push
        precmds.push(precmd);
      });
    });
    res.json(precmds);
  });
});

//Adds new precmd
router.post('/precmds',auth, function(req, res, next) {
  var precmd = new Precmd(req.body.precmd);
  precmd.username = req.payload.username;
  precmd.save(function(err, precmd){
    if(err){ return next(err); }
    //precmd success
    var reservation = new Reservation(req.body.reservations);
    reservation.precmd = precmd;
    reservation.save(function(err, reservation){
      if(err){ return next(err); }

      precmd.reservations.push(reservation);
      precmd.save(function(err, precmd) {
        if(err){ return next(err); }

        res.json(precmd);
      });
    });
  });
});

//preloading precmds
router.param('precmd', function(req, res, next, id) {
  var query = Precmd.findById(id);

  query.exec(function (err, precmd){
    if (err) { return next(err); }
    if (!precmd) { return next(new Error('can\'t find précommande')); }

    req.precmd = precmd;
    return next();
  });
});

//returns single precmd
router.get('/precmds/:precmd',function(req, res, next) {
  //populate() to retrieve reservations along with precmds:
  req.precmd.populate('reservations', function(err, precmd) {
    if (err) { return next(err); }

    res.json(precmd);
  });
});

//create route for complete precmd
router.put('/precmds/:precmd/complete', function(req, res, next) {
  req.precmd.complete(function(err, precmd){
    if (err) { return next(err); }

    res.json(precmd);
  });
});

//returns a JSON object containing all precmds unfinished for today

//annuler/preparer/retrait precmd

//returns several history precmds

module.exports = router;
