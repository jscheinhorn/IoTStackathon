import Axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CHART = 'GET_CHART'
// const ADD_CHART = 'ADD_CHART'
// const ADD_DATA = 'ADD_DATA'

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
    dispatch(getChart(chart))
  } catch (err) {
    console.error(err)
  }
}

// MIGRATING THIS TO store/data.js SO UPDATES TO GRAPH AREN'T WITHOUT DATA, DEPRECATED!
export const addDataThunk = (data, id) => async dispatch => {
  console.log('DATA COMING IN TO ADD_DATA', data)
  try {
    const chart = await Axios.put(`/api/chart/${id}`, data)
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
