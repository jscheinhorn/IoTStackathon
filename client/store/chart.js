import Axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CHARTID = 'GET_CHARTID'
const GET_CHART = 'GET_CHART'
const GET_CHARTS = 'GET_CHARTS'

/**
 * INITIAL STATE
 */
const defaultData = {id: 0, chartsArray: [], chart: []}

/**
 * ACTION CREATORS
 */
const getChartId = chartId => ({type: GET_CHARTID, chartId})
const getChart = chart => ({type: GET_CHART, chart})
const getCharts = chartsArray => ({type: GET_CHARTS, chartsArray})

/**
 * THUNK CREATORS
 */
// Get chart by id
export const getChartThunk = id => async dispatch => {
  try {
    const chart = await Axios.get(`/api/chart/${id}`)
    dispatch(getChart(chart))
  } catch (err) {
    console.error(err)
  }
}

export const getChartsThunk = () => async dispatch => {
  try {
    const chartsArray = await Axios.get('/api/chart')
    dispatch(getCharts(chartsArray.data))
  } catch (err) {
    console.error(err)
  }
}

// Add new chart to DB
export const addChartThunk = data => async dispatch => {
  try {
    const chart = await Axios.put('/api/chart', data) // put is used to create OR update; here it is being used to create a new graph in the DB, leaving the option open to change the name of a given graph. The return is the new/existing graph.
    let chartId = chart.data.id
    await Axios.put(`/api/chart/${chartId}`, data) // Add this data to the DB
    dispatch(getChartId(chartId))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultData, action) {
  switch (action.type) {
    case GET_CHARTID:
      return {...state, id: action.chartId}
    case GET_CHART:
      return {...state, chart: action.chart}
    case GET_CHARTS:
      return {...state, chartsArray: action.chartsArray}
    default:
      return state
  }
}
