import React from 'react'
import {Chart as Graph} from 'chart.js'
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk} from '../store'

class ChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef()
    this.state = {record: false}
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'x',
          data: [],
          fill: true,
          backgroundColor: 'rgba(255, 0, 255, 0.75)',
          borderColor: '#6610f2'
        },
        {
          label: 'y',
          data: [],
          fill: true,
          backgroundColor: 'rgba(0, 255, 0, 0.75)',
          borderColor: 'rgb(34,139,34)'
        },
        {
          label: 'z',
          data: [],
          fill: true,
          backgroundColor: 'rgba(0, 0, 255, 0.75)',
          borderColor: 'rgba(255, 0, 255, 0.75)'
        }
      ]
    }
    this.time = Date.now()
    this.latency = 0
  }

  chart = {}

  componentDidMount() {
    this.props.addChart()
    this.initializeChart({
      data: this.data,
      options: {
        title: {
          display: true,
          text: 'Acceleration Data',
          fontSize: 25
        },
        legend: {
          labels: {
            fontSize: 16
          },
          position: 'bottom'
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Time (milliseconds)',
                fontSize: 20
              },
              ticks: {
                beginAtZero: true,
                fontSize: 20
              }
            }
          ],
          yAxes: [
            {
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Acceleration (gravity)',
                fontSize: 20
              },
              ticks: {
                beginAtZero: true,
                fontSize: 20
              }
            }
          ]
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      type: 'line',
      legend: {display: false},
      tooltips: {
        enabled: false
      }
    })
  }

  componentDidUpdate = () => {
    this.data.labels.push(Date.now() - this.time)
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
    if (this.state.record) {
      this.save()
    }
    this.setState({record: !this.state.record})
  }

  save = () => {
    console.log(
      "That's nice that you want to save your graph, but this feature's not yet available."
    )
    const timeDiff = this.data.labels.map((el, idx) => {
      if (idx + 1 === this.data.labels.length) {
        return el - this.data.labels[idx - 1]
      } else return this.data.labels[idx + 1] - el
    })
    const avgLatency =
      timeDiff.reduce((acc, el) => acc + el, 0) / timeDiff.length
    this.latency = avgLatency
    return avgLatency
  }

  render() {
    if (this.state.record) {
      this.props.getData(this.props.ip, this.props.chart.data.id)
    }
    const divStyle = {position: 'relative', height: '100px'}
    return (
      <div>
        <h1>This Old Chart</h1>
        <div>
          {!this.state.record && this.data.labels.length
            ? 'Average latency between data transmission (seconds): ' +
              this.latency / 1000
            : null}
        </div>
        <div className="chart-container" style={divStyle}>
          <canvas ref={this.chartRef} height="110px" />
          <button type="button" onClick={this.startRecording}>
            {!this.state.record ? 'Record' : 'Stop'}
          </button>
          <button type="button" onClick={this.save}>
            Save
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
