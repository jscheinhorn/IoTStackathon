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
    let data = await fetch(`http://${ip}`) // get single reading from ESP's IP address
    data = await data.json() // Format it (have to do another await)
    const chart = await Axios.put(`/api/chart/${chartId}`, data) // Add this data to the chart
    data = {data, chart} // Object with current reading and most recent chart
    dispatch(getData(data || defaultData))
  } catch (err) {
    console.error(err)
  }
}
/* PROPOSAL: Separate getDataThunk into one IP call (await fetch and data.json)
1. Thunk for IP call with current data
2. Thunk to save the data as new chart in DB
Require: new action creator for just data and just chart?
Should reducer still return x,y,z, and chart? Chart may only arise once saved, do we need a current chart?
*/

/**
 * REDUCER
 */
export default function(state = defaultData, action) {
  switch (action.type) {
    case GET_DATA:
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
