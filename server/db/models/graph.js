const Sequelize = require('sequelize')
const db = require('../db')

const Graph = db.define('graph', {
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // Makes all the graphs for that session (I think) have the same stamp
  },
  title: {
    type: Sequelize.STRING,

    get() {
      return () => this.getDataValue('id')
    }
  }
})

module.exports = Graph
