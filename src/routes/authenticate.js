const express = require('express')
const router = express.Router()

const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth')

// fth SignUp
router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup')
})

router.post(
  '/signup',
  isNotLoggedIn,
  passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  })
)

// singin
router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin')
})

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  // req.check('username', 'Username is Required').notEmpty()
  // req.check('password', 'Password is Required').notEmpty()
  // const errors = req.validationErrors()
  // if (errors.length > 0) {
  //   req.flash('message', errors[0].msg)
  //   res.redirect('/signin')
  // }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next)
})

// fth logout
router.get('/logout', isLoggedIn, (req, res) => {
  req.logOut()
  res.redirect('/signin')
})

// fth profile
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('auth/profile')
})

module.exports = router
