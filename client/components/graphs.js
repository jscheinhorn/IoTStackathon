import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getChartsThunk} from '../store'
import {Link} from 'react-router-dom'

class GraphsComponent extends Component {
  componentDidMount() {
    this.props.getGraphs()
  }

  render() {
    return (
      <div>
        <h1>Previous Graph Data</h1>
        <ol>
          {this.props.charts.length ? (
            this.props.charts.map(chart => {
              let date = chart.date.substring(0, 10)
              return (
                <div key={chart.id}>
                  <Link to={`/graphs/${chart.id}`}>
                    <li>{date}</li>
                  </Link>
                </div>
              )
            })
          ) : (
            <div>There are no graphs currently available</div>
          )}
        </ol>
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
