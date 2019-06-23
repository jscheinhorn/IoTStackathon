import React from 'react'
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk, addDataThunk} from '../store'
// import Chart from 'chart.js'
import {Bar, Line, Pie} from 'react-chartjs-2'

class ChartComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      renderChart: false,
      record: false,
      data: {
        labels: ['x', 'y', 'z', 't'],
        datasets: [
          {
            label: 'x',
            backgroundColor: 'rgba(255, 0, 255, 0.75)',
            data: [0, 5, 4, 12, 11, 16]
          },
          {
            label: 'y',
            backgroundColor: 'rgba(0, 255, 0, 0.75)',
            data: [10, 15, 14, 22, 21, 26]
          },
          {
            label: 'z',
            backgroundColor: 'rgba(0, 0, 255, 0.75)',
            data: [20, 25, 24, 32, 31, 36]
          }
        ]
      }
    } // eslint-disable-next-line react/no-unused-state
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps.data)
  //   if (nextProps.data !== this.props.data) {
  //     return true
  //   }
  //   return false
  // }

  handleClick = event => {
    console.log('New Graph')
    if (!this.state.renderChart) {
      this.props.addChart()
    }
    this.setState({
      renderChart: true
    })
  }

  startRecording = event => {
    this.setState({record: !this.state.record})
  }

  render() {
    if (this.state.record) {
      // getData continuously gets data if placed in render, but it is slower than add Data
      this.props.getData(this.props.ip, this.props.chart.data.id)
      // this.props.addData(this.props.data, this.props.chart.data.id)
    }
    return (
      <div>
        <h1>This Old Chart</h1>
        <button type="button" onClick={this.handleClick}>
          New Chart
        </button>
        {this.state.renderChart ? (
          <div>
            <Line options={{responsive: true}} data={this.state.data} />
            <button type="button" onClick={this.startRecording}>
              {!this.state.record ? 'Record' : 'Stop'}
            </button>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  chart: state.chart,
  ip: state.ip,
  data: state.data
})

const mapDispatchToProps = dispatch => ({
  getData: (ip, chartId) => dispatch(getDataThunk(ip, chartId)),
  addChart: () => dispatch(addChartThunk())
  // addData: (data, id) => dispatch(addDataThunk(data, id))
})

const Chart = connect(mapStateToProps, mapDispatchToProps)(ChartComponent)

export default Chart
