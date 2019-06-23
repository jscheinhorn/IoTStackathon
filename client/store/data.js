import Axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_DATA = 'GET_DATA'

/**
 * INITIAL STATE
 */
const defaultData = {x: 0, y: 0, z: 0, chart: 0}

/**
 * ACTION CREATORS
 */
const getData = (data, chart) => ({type: GET_DATA, data, chart})

/**
 * THUNK CREATORS
 */
export const getDataThunk = (ip, chartId) => async dispatch => {
  try {
    let data = await fetch(`http://${ip}`)
    data = await data.json()
    const chart = await Axios.put(`/api/chart/${chartId}`, data)
    console.log({data, chart})
    data = {data, chart}
    dispatch(getData(data || defaultData))
    // dispatch(getChart(chart))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultData, action) {
  switch (action.type) {
    case GET_DATA:
      console.log({action})
      console.log('data', action.data)
      // console.log('chart', action.chart)
      return {
        ...state,
        x: action.data.data.x,
        y: action.data.data.y,
        z: action.data.data.z,
        chart: action.data.chart
      }
    default:
      return state
  }
}
