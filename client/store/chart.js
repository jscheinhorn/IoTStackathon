import Axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CHART = 'GET_CHART'
// const ADD_CHART = 'ADD_CHART'

/**
 * INITIAL STATE
 */
const defaultData = {id: 0}

/**
 * ACTION CREATORS
 */
const getChart = chart => ({type: GET_CHART, chart})
// const addChart = chart => ({type: ADD_CHART, chart})

/**
 * THUNK CREATORS
 */
export const getChartThunk = id => async dispatch => {
  try {
    const chart = await Axios.get('/api/chart', {id: id})
    dispatch(getChart(chart))
  } catch (err) {
    console.error(err)
  }
}

export const addChartThunk = () => async dispatch => {
  try {
    const chart = await Axios.put('/api/chart')
    console.log(chart)
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
