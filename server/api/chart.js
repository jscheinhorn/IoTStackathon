const router = require('express').Router()
const {Graph, Data} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const graph = await Graph.findAll()
    res.json(graph)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const graph = await Graph.findOne({
      where: {id: id},
      include: [{model: Data}]
    })
    res.json(graph)
  } catch (err) {
    next(err)
  }
})

// Want to add Title? Keep it simple, make this a create route
router.put('/', async (req, res, next) => {
  try {
    const graph = await Graph.create(
      {title: 'New Graph'},
      {
        include: [{model: Data}]
      }
    )
    // const graph = await Graph.findByPk(data.id, {
    //   include: [{model: Data, required: true}]
    // })
    res.json(graph)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  const graphId = req.params.id
  const {x, y, z} = req.body
  try {
    await Data.create({graphId, x, y, z})
    const graph = await Graph.findByPk(graphId, {
      include: [{model: Data, required: true}]
    })
    res.json(graph)
  } catch (err) {
    next(err)
  }
})
