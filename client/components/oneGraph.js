import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getChartsThunk} from '../store'

class OneGraphComponent extends Component {
  componentDidMount() {
    console.log('At single graph')
  }

  render() {
    let graphId = this.props.match.params.graphId
    console.log({graphId})
    return (
      <div>
        <h1>{`Graph ${graphId} Data`}</h1>
      </div>
    )
  }
}

// const mapDispatchToProps = dispatch => ({
//   getGraphs: () => dispatch(getChartsThunk())
// })

// const mapStateToProps = state => ({
//   charts: state.chart.chartsArray
// })

// const Graph = connect(mapStateToProps, mapDispatchToProps)(OneGraphComponent)

export default OneGraphComponent
