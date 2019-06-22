const Sequelize = require('sequelize')
const db = require('../db')

const Graph = db.define('graph', {
  date: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  },
  title: {
    type: Sequelize.STRING,

    // `Graph ${this.getDataValue('id')}`

    get() {
      return () => this.getDataValue('id')
    }
  }
})

module.exports = Graph
