/**
 * ACTION TYPES
 */
const GET_DATA = 'GET_DATA'

/**
 * INITIAL STATE
 */
const defaultData = {'x-axis': 0, 'y-axis': 0, 'z-axis': 0}

/**
 * ACTION CREATORS
 */
const getData = data => ({type: GET_DATA, data})

/**
 * THUNK CREATORS
 */
export const getDataThunk = ip => async dispatch => {
  try {
    const data = await fetch(`http://${ip}`)
    dispatch(getData((await data.json()) || defaultData))
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
      return {
        ...state,
        'x-axis': action.data.x,
        'y-axis': action.data.y,
        'z-axis': action.data.z
      }
    default:
      return state
  }
}
