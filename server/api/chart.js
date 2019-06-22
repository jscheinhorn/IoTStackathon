const router = require('express').Router()
const {Graph} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  const {id} = req.body
  try {
    const graph = await Graph.findOne({
      where: {id: id}
    })
    res.json(graph)
  } catch (err) {
    next(err)
  }
})
