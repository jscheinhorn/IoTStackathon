const router = require('express').Router()
const {Graph, Data} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const graphs = await Graph.findAll()
    res.json(graphs)
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

// Get arrays of time, x, y, and z data from component/store. Convert it into array of objects that include the graphId.
// bulkCreate accepts the array of objects
router.put('/:id', async (req, res, next) => {
  const graphId = req.params.id
  const {time, x, y, z} = req.body
  let data = time.map((t, idx) => {
    return {t, x: x[idx], y: y[idx], z: z[idx], graphId}
  })
  try {
    await Data.bulkCreate(data) // bulkCreate requires an array of objects. I only have arrays of data...
    // Use the below to access stored graphs:
    // const graph = await Graph.findByPk(graphId, {
    //   include: [{model: Data, required: true}]
    // })
    // res.json(graph)
    res.send()
  } catch (err) {
    next(err)
  }
})
