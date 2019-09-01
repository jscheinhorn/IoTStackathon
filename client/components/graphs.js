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
        <h1>I Exist</h1>
        <ul>{}</ul>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getGraphs: () => dispatch(getChartsThunk())
})

const mapStateToProps = state => ({
  charts: state.chartsArray
})

const Graphs = connect(mapStateToProps, mapDispatchToProps)(GraphsComponent)

export default Graphs
