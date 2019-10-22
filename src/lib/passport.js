const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../database')
const helpers = require('./helpers')

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      const { fullname } = req.body
      const newUser = {
        username,
        password,
        fullname
      }
      newUser.password = await helpers.encryptPassword(password)
      const result = await db.query('INSERT INTO users SET ? ', newUser)
      newUser.id = result.insertId
      return done(null, newUser)
    }
  )
)

passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      const rows = await db.query('SELECT * FROM users WHERE username = ?', [
        username
      ])
      if (rows.length > 0) {
        const user = rows[0]
        const validPassword = await helpers.comparePassword(
          password,
          user.password
        )
        if (validPassword) {
          done(null, user, req.flash('success', `Welcome ${user.username}`))
        } else {
          done(null, false, req.flash('message', 'Incorrect Password'))
        }
      } else {
        return done(
          null,
          false,
          req.flash('message', 'The Username does not exists.')
        )
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const rows = await db.query('SELECT * FROM users WHERE ID = ?', [id])
  done(null, rows[0])
})
