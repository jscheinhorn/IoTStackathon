/**
 * ACTION TYPES
 */
const GET_IP = 'GET_IP'

/**
 * INITIAL STATE
 */
const defaultData = 0

/**
 * ACTION CREATORS
 */
const getIp = (ip0, ip1, ip2, ip3) => ({type: GET_IP, ip0, ip1, ip2, ip3})

/**
 * THUNK CREATORS
 */
export const getIpThunk = () => async dispatch => {
  try {
    const data = await fetch('http://esp8266.local')
    const {ip0, ip1, ip2, ip3} = await data.json()

    dispatch(getIp(ip0, ip1, ip2, ip3))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultData, action) {
  switch (action.type) {
    case GET_IP:
      return String(
        action.ip0 + '.' + action.ip1 + '.' + action.ip2 + '.' + action.ip3
      )
    default:
      return state
  }
}
