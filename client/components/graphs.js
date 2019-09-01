import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getChartsThunk} from '../store'

class GraphsComponent extends Component {
  // constructor() {
  // }
  componentDidMount() {
    this.props.getGraphs()
  }

  render() {
    return (
      <div>
        <h1>Previous Graph Data</h1>
        <ul>
          {this.props.charts
            ? this.props.charts.map(chart => {
                return (
                  <div key={chart.id}>
                    <span>
                      <li>{chart.id}</li>
                      <li>{chart.date}</li>
                    </span>
                  </div>
                )
              })
            : null}
        </ul>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getGraphs: () => dispatch(getChartsThunk())
})

const mapStateToProps = state => ({
  charts: state.chart.chartsArray
})

const Graphs = connect(mapStateToProps, mapDispatchToProps)(GraphsComponent)

export default Graphs
