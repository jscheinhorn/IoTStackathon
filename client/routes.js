import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome} from './components'
import {me, getDataThunk, getIpThunk} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount = () => {
    this.props.loadInitialData()
    this.props.getIP()
  }

  render() {
    const {isLoggedIn} = this.props
    // if (this.props.ip) {
    //   this.props.dataThunk(this.props.ip)
    //   console.log(this.props.data)
    // }
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/home" component={UserHome} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => ({
  // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
  // Otherwise, state.user will be an empty object, and state.user.id will be falsey
  isLoggedIn: !!state.user.id,
  data: state.data,
  ip: state.ip
})

const mapDispatch = dispatch => ({
  loadInitialData: () => dispatch(me()),
  dataThunk: ip => dispatch(getDataThunk(ip)),
  getIP: () => dispatch(getIpThunk())
})

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
