import React from 'react'
// import {Chart as Graph} from 'react-chartjs-2'
import {Chart as Graph} from 'chart.js'
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk} from '../store'

class ChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef()
    this.state = {renderChart: false, record: false}
    this.data = {
      labels: [],
      datasets: [
        {label: 'x', data: [], fill: false, borderColor: '#6610f2'},
        {label: 'y', data: [], fill: false, borderColor: '#6610f2'},
        {label: 'z', data: [], fill: false, borderColor: '#6610f2'}
      ]
    }
  }

  chart = {}

  componentDidMount() {
    this.props.addChart()
    this.initializeChart({
      data: this.data,
      responsive: true,
      // maintainAspectRatio: false,
      type: 'line',
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              displayFormats: {
                millisecond: 'mm:ss:SSS'
              }
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      legend: {display: false},
      tooltips: {
        enabled: false
      }
    })
  }

  componentDidUpdate = () => {
    this.data.labels.push(new Date())
    this.data.datasets.forEach(el => {
      switch (el.label) {
        case 'x':
          el.data.push(this.props.data.x)
          break
        case 'y':
          el.data.push(this.props.data.y)
          break
        case 'z':
          el.data.push(this.props.data.z)
          break
        default:
          console.log("How'd I get here?")
      }
    })
    this.chart.update()
  }

  initializeChart(options) {
    let ctx = this.chartRef.current.getContext('2d')
    this.chart = new Graph(ctx, options)
  }

  startRecording = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({record: !this.state.record})
    console.log('chart:', this.chart)
  }

  render() {
    if (this.state.record) {
      this.props.getData(this.props.ip, this.props.chart.data.id)
    }
    return (
      <div>
        <h1>This Old Chart</h1>
        <canvas ref={this.chartRef} height="400px" />
        <button type="button" onClick={this.startRecording}>
          {!this.state.record ? 'Record' : 'Stop'}
        </button>
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
