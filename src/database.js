const mysql = require('mysql')
const { promisify } = require('util')
const { database } = require('./keys')

const pool = mysql.createPool(database)

pool.getConnection((error, connection) => {
  if (error) {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('DATABASE CONNECTION WAS CLOSED')
    }
    if (error.code === 'ER_CON_ERROR') {
      console.log('DATABASE HAS TO MANY CONNECTIONS')
    }
    if (error.code === 'ECONNREFUSED') {
      console.log('DATABASE CONNECTION WAS REFUSED')
    }
  }
  if (connection) {
    console.log('DB IS CONNECTED')
  }
})

// convert to async await or promises
pool.query = promisify(pool.query)

module.exports = pool
