import React from 'react'
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk} from '../store'
// import Chart from 'chart.js'
import {Bar, Line, Pie} from 'react-chartjs-2'
import {throws} from 'assert'

class GraphComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      renderGraph: false
    }
  }

  handleClick = event => {
    console.log('New Graph')
    if (!this.state.renderGraph) {
      this.props.addChart()
    }
    this.setState({
      renderGraph: true
    })
  }

  render() {
    if (this.state.renderGraph) {
      // This continuously gets data if placed in render
      // console.log(this.props.ip)
      // this.props.dataThunk(this.props.ip)
      // console.log(this.props.data)
    }
    return (
      <div>
        <h1>This Old Chart</h1>
        <button type="button" onClick={this.handleClick}>
          New Graph
        </button>
        {this.state.renderGraph ? <Bar data={this.props.chart} /> : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  // data: state.data
  chart: state.chart,
  ip: state.ip,
  data: state.data
})

const mapDispatchToProps = dispatch => ({
  dataThunk: ip => dispatch(getDataThunk(ip)),
  addChart: () => dispatch(addChartThunk())
})

const Graph = connect(mapStateToProps, mapDispatchToProps)(GraphComponent)

export default Graph
