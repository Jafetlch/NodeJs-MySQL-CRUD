const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../database')
const { encryptPassword, comparePassword } = require('../lib/helpers')

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
      newUser.password = await encryptPassword(passport)
      const result = await db.query('INSERT INTO users SET ?', [newUser])
      newUser.id = result.insertId
      return done(null, newUser)
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
