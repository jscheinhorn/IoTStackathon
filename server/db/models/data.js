const Sequelize = require('sequelize')
const db = require('../db')

const Data = db.define('data', {
  t: {
    // in milliseconds
    type: Sequelize.DATE,
    defaultValue: new Date()
    /* get() {
        want to get Date from parent graph and do
        deltaT = parent.date - new Date()
       } */
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
