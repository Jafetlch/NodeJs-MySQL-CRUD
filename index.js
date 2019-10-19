const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
// init
const app = express()

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
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Variables
app.use((req, res, next) => {
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
