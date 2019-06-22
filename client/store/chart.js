import Axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CHART = 'GET_CHART'

/**
 * INITIAL STATE
 */
const defaultData = {}

/**
 * ACTION CREATORS
 */
const getChart = chart => ({type: GET_CHART, chart})

/**
 * THUNK CREATORS
 */
export const getChartThunk = id => async dispatch => {
  try {
    const chart = await Axios.get('/api/', {id: id})
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
      return action.chart
    default:
      return state
  }
}
