import React from 'react'
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk} from '../store'
import {Bar, Line, Pie, Chart as Graph} from 'react-chartjs-2'

class ChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef()
    this.state = {
      renderChart: false,
      record: false
    }
    this.data = {
      labels: [],
      datasets: [
        {label: 'x', backgroundColor: 'rgba(255, 0, 255, 0.75)', data: []},
        {label: 'y', backgroundColor: 'rgba(0, 255, 0, 0.75)', data: []},
        {label: 'z', backgroundColor: 'rgba(0, 0, 255, 0.75)', data: []}
      ]
    }
  }

  myLineChart = {
    ctx: this.chartRef.current.getContext('2d'),
    chartInstance: new Graph(this.myLineChart.ctx, {
      type: 'line',
      options: {responsive: true, maintainAspectRatio: false}
    })
  }

  componentDidMount = () => {
    this.handleClick()
    if (this.chartRef.current) {
      this.buildChart()
    }
  }

  componentDidUpdate = () => {
    console.log('chartRef.current', this.chartRef.current)
    console.log('this.myLineChart: ', this.myLineChart)
    if (typeof myLineChart !== 'undefined') {
      this.data.labels.push(new Date())
      this.data.datasets.forEach(el => {
        switch (el.label) {
          case 'x':
            this.data.push(this.props.data.x)
            break
          case 'y':
            this.data.push(this.props.data.x)
            break
          case 'z':
            this.data.push(this.props.data.x)
            console.log("What's the updated data: ", this.data[0].data)
            break
          default:
            console.log("How'd I get here?")
        }
      })
    }
  }

  handleClick = () => {
    console.log('New Graph')
    if (!this.state.renderChart) {
      this.props.addChart()
    }
    this.setState({
      renderChart: true
    })
  }

  buildChart = () => {
    // const myChartRef = this.chartRef.current.getContext('2d')

    if (typeof myLineChart !== 'undefined') {
      this.myLineChart.destroy()
    }

    this.myLineChart = new Graph(this.myChartRef, {
      type: 'line',
      options: {responsive: true, maintainAspectRatio: false}
    })
  }

  startRecording = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({record: !this.state.record})
  }

  render = () => {
    if (this.state.record) {
      this.props.getData(this.props.ip, this.props.chart.data.id)
    }
    return (
      <div>
        <h1>This Old Chart</h1>
        <button type="button" onClick={this.handleClick}>
          New Chart
        </button>
        {/* {this.state.renderChart ? (
          <div>
            <div>
              <Line data={this.data} ref={this.chartRef} />
            </div>
            <button type="button" onClick={this.startRecording}>
              {!this.state.record ? 'Record' : 'Stop'}
            </button>
          </div>
        ) : null} */}
        <div>
          <div>
            <Line data={this.data} ref={this.chartRef} />
          </div>
          <button type="button" onClick={this.startRecording}>
            {!this.state.record ? 'Record' : 'Stop'}
          </button>
        </div>
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
})

const Chart = connect(mapStateToProps, mapDispatchToProps)(ChartComponent)

export default Chart
