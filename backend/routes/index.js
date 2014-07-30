var express = require('express');
var router = express.Router();
var level = require('level');
var db = level('./db');
var sc = require('soundclouder');

sc.init('8602754b7e631dee78add76ddd5169a2', 'a98d4bc32bab450397c4632448a80e02', 'http://soundcloud.labs.lythell.com/redirect');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//
//  Handle signup npm module used is: https://www.npmjs.org/package/soundclouder
//
router.get('/signup', function(req, res) {
  var user = req.query.user;
  console.log(user);
  var url = sc.getConnectUrl({client_id: '8602754b7e631dee78add76ddd5169a2', client_secret: 'a98d4bc32bab450397c4632448a80e02', redirect_uri: 'http://soundcloud.labs.lythell.com/redirect', response_type: 'code'});

  res.redirect(url);
  router.get('/redirect', function(req, res) {
    sc.auth(req.query.code, function (error, access_token) {
      if (error) {
          console.error(e.message);
      } else {
          sc.get('/me', access_token, function(error, data){
            db.put(user, data, {valueEncoding: 'json'}, function() {
                db.get(user, function(err, value) {
                    console.log(value);
                    console.log(user);
                    res.render('index', {title: 'thanks'});
                });
            });
          });
      }
    });
  });
});

//
//  check for songs from extension
//
router.post('/', function(req,res) {
  db.get(req.body.url, function(err, value) {
    if (err && err.notFound) {
      res.send(false);
    } else {
      res.send(value);
    }
  });
});

//
//  save songs from extension
//
router.post('/save', function(req, res) {

    db.put(req.body.url, req.body.value, function() {
        db.get(req.body.url, function(err, value) {
            console.log(value);
            res.send(true);
        });
    });
});


//
// user check.. not implemented TBC
//
router.post('/user', function(req, res) {
  db.get(req.body.user, function(err, value) {
    if (err && err.notFound) {
      res.send(false);
    } else {
      console.log(value);
      res.send(value);
    }
  });
});

module.exports = router;
