import Axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_DATA = 'GET_DATA'

/**
 * INITIAL STATE
 */
const defaultData = {x: 0, y: 0, z: 0}

/**
 * ACTION CREATORS
 */
const getData = data => ({type: GET_DATA, data})

/**
 * THUNK CREATORS
 */
export const getDataThunk = ip => async dispatch => {
  try {
    let data = await fetch(`http://${ip}`) // get single reading from ESP's IP address
    data = await data.json() // Format it (have to do another await)
    data = {data} // Object with current reading and most recent chart
    dispatch(getData(data || defaultData))
  } catch (err) {
    console.error(err)
  }
}

export const storeDataThunk = (ip, chartId) => async dispatch => {
  try {
    let data = await fetch(`http://${ip}`) // get single reading from ESP's IP address
    data = await data.json() // Format it (have to do another await)
    // const chart = await Axios.put(`/api/chart/${chartId}`, data) // Add this data to the DB
    data = {data, chart: 0} // Object with current reading and most recent chart
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
Where is chartId?
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
        z: action.data.data.z
      }
    default:
      return state
  }
}
