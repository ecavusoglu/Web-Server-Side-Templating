const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.argv[2] || 3000;
const wsurl = process.argv[3];
const mustacheExpress = require('mustache-express');
const axios = require('axios');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(port, function(){
  console.log('RESTful API server started on: ' + port);
});

app.get('/index.html', function(req, res){
  res.render('index');
});

app.get('/hidePage.html', function(req, res){
  axios({
    method: 'get',
    url: wsurl + '/api/images/inputs',
  })
  .then(function(response){
    res.render('hidePage', {
      imageList: response.data
    });
  })
  .catch(function(err){
    res.render('hidePage', {
      errMessage: err
    });
  });
});

app.post('/hidePage.html', function(req, res){
  axios({
    method: 'post',
    url: wsurl + '/api/steg/inputs/' + req.body.answer,
    data: {
      msg: req.body.messageContent,
      outGroup: 'steg'
    }
  })
  .then(function(response){
    res.render('hideSuccessPage', {
      imageName: req.body.answer,
      msgContent: req.body.messageContent
    });
  })
  .catch(function(err) {
    res.render('hidePage', {
      errMessage: err
    });
  });
});

app.get('/unhidePage.html', function(req, res){
  axios({
    method: 'get',
    url: wsurl + '/api/images/outputs',
  })
  .then(function(response){
    res.render('unhidePage', {
      imageList: response.data
    });
  })
  .catch(function(err) {
    res.render('unhidePage', {
      errMessage: err
    });
  })
});

app.post('/unhidePage.html', function(req, res){
  axios({
    method: 'get',
    url: wsurl + '/api/steg/outputs/' + req.body.answer,
  })
  .then(function(response){
    res.render('unhideSuccessPage', {
      hiddenMessage: response.data.msg
    });
  })
  .catch(function(err) {
    res.render('unhidePage', {
      errMessage: err
    });
  });
});

module.exports = server;
