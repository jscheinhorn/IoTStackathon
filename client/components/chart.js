import React from 'react'
import {connect} from 'react-redux'
import {getDataThunk} from '../store'
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
    this.setState({
      renderGraph: true
    })
    console.log('New Graph')
    // This continuously gets data
    if (this.props.ip) {
      console.log(this.props.ip)
      this.props.dataThunk(this.props.ip)
      console.log(this.props.data)
    }
  }

  render() {
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
  dataThunk: ip => dispatch(getDataThunk(ip))
})

const Graph = connect(mapStateToProps, mapDispatchToProps)(GraphComponent)

export default Graph
