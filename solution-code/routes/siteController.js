/*jshint esversion: 6 */
const express = require('express');
const siteController = express.Router();
// Models
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

siteController.get('/', (req, res, next) =>{
  res.render('site/index');
});

siteController.get('/forbidden', (req, res, next) =>{
  res.render('site/forbidden', {user: req.user });
});

module.exports = siteController;
