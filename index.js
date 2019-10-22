const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const flash = require('connect-flash')
const passport = require('passport')

const { database } = require('./src/keys')

// fth init
const app = express()
require('./src/lib/passport')

// fth settings
app.set('port', process.env.PORT || 5000)
app.set('views', path.join(__dirname, './src/views'))
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./src/lib/handlebars')
  })
)
app.set('view engine', '.hbs')

// fth Middlewares
app.use(
  session({
    secret: 'feather.io',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  })
)
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

// fth Variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  app.locals.success = req.flash('message')
  app.locals.user = req.user
  next()
})

// fth Routes
app.use(require('./src/routes'))
app.use(require('./src/routes/authenticate'))
app.use('/links', require('./src/routes/links'))

// fth Public
app.use(express.static(path.join(__dirname, './src/public')))
// fth Server
app.listen(app.get('port'), () =>
  console.log(`Server on port ${app.get('port')}`)
)
