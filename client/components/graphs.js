import React, {Component} from 'react'
import {getChartsThunk} from '../store'

class GraphsComponent extends Component {
  constructor() {
    super()
    this.state = {some: 'thing'}
  }
  componentDidMount() {
    this.props.getGraphs()
  }

  render() {
    return (
      <div>
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
