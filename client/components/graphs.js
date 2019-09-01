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
          {this.props.charts
            ? this.props.charts.map(chart => {
                let date = chart.date.substring(0, 10)
                console.log(typeof date)
                return (
                  <div key={chart.id}>
                    <Link to={`/graphs/${chart.id}`}>
                      <li>{date}</li>
                    </Link>
                  </div>
                )
              })
            : null}
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
