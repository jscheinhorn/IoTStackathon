import Axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CHART = 'GET_CHART'

/**
 * INITIAL STATE
 */
const defaultData = {id: 0}

/**
 * ACTION CREATORS
 */
const getChart = chart => ({type: GET_CHART, chart})

/**
 * THUNK CREATORS
 */
// Get chart by id
export const getChartThunk = id => async dispatch => {
  try {
    const chart = await Axios.get('/api/chart', {id: id})
    dispatch(getChart(chart))
  } catch (err) {
    console.error(err)
  }
}

// Add new chart to DB
export const addChartThunk = data => async dispatch => {
  try {
    const chart = await Axios.put('/api/chart', data) // put is used to create OR update; here it is being used to create a new graph in the DB, leaving the option open to change the name of a given graph. The return is the new/existing graph.
    dispatch(getChart(chart))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultData, action) {
  switch (action.type) {
    case GET_CHART:
      return {...state, id: action.chart.data.id}
    default:
      return state
  }
}
