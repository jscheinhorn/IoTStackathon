const Sequelize = require('sequelize')
const db = require('../db')

const Data = db.define('data', {
  t: {
    // in milliseconds
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  x: {
    type: Sequelize.FLOAT
  },
  y: {
    type: Sequelize.FLOAT
  },
  z: {
    type: Sequelize.FLOAT
  }
})

module.exports = Data
