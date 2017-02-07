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
  res.render('index');
});

siteController.get('/forbidden', (req, res, next) =>{
  res.render('forbidden');
});

module.exports = siteController;
