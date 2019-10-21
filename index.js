const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const flash = require('connect-flash')
const passport = require('passport')

const { database } = require('./src/keys')

// init
const app = express()
require('./src/lib/passport')

// settings
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

// Middlewares
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

// Variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  next()
})

// Routes
app.use(require('./src/routes'))
app.use(require('./src/routes/authntication'))
app.use('/links', require('./src/routes/links'))

// Public
app.use(express.static(path.join(__dirname, './src/public')))
// Server
app.listen(app.get('port'), () =>
  console.log(`Server on port ${app.get('port')}`)
)
