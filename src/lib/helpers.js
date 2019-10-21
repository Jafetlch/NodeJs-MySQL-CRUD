/* eslint-disable prettier/prettier */
const bcrypt = require('bcryptjs')
const helpers = {}

helpers.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10)
  const pass = await bcrypt.hash(password, salt)
  return pass
}

helpers.comparePassword = async (password, savedPassword) => {
  try {
    await bcrypt.compare(password, savedPassword)
  }
  catch (error) {
    console.error(error)
  }
}

module.exports = helpers
