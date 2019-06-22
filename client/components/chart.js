import React from 'react'
import {connect} from 'react-redux'
import {getDataThunk} from '../store'
// import Chart from 'chart.js'
import {Bar, Line, Pie} from 'react-chartjs-2'
import {throws} from 'assert'

class GraphComponent extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div>
        <h1>This Old Chart</h1>
        <Bar data={this.props.chart} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  // data: state.data
  chart: state.data
})

const mapDispatchToProps = dispatch => ({
  dataThunk: () => dispatch(getDataThunk())
})

const Graph = connect(mapStateToProps, mapDispatchToProps)(GraphComponent)

export default Graph
