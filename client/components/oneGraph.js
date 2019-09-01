import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getChartThunk} from '../store'

class OneGraphComponent extends Component {
  constructor(props) {
    super(props)
    this.graphId = props.match.params.graphId
  }
  componentDidMount() {
    this.props.getGraph(this.graphId)
  }

  render() {
    return (
      <div>
        <h1>{`Graph ${this.graphId} Data`}</h1>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getGraph: graphId => dispatch(getChartThunk(graphId))
})

// const mapStateToProps = state => ({
//   charts: state.chart.chartsArray
// })

const Graph = connect(null, mapDispatchToProps)(OneGraphComponent)

export default Graph
