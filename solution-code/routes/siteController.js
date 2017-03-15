const express        = require('express');
const siteController = express.Router();

siteController.get('/', (req, res, next) =>{
  res.render('site/index',{message: req.flash("error")});
});

siteController.get('/forbidden', (req, res, next) =>{
  res.render('site/forbidden', {user: req.user });
});

module.exports = siteController;
