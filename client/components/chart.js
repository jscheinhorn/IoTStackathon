import React from 'react'
import {Chart as Graph} from 'chart.js' // chart.js refers not to this file, but to the library
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk} from '../store'

class ChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef() // provides ref to DOM element
    this.state = {record: false} // logic to start and stop recording; default is off
    this.data = {
      labels: [], // this populates with the collected data's abscissa values (here a time-stamp)
      datasets: [
        {
          label: 'x',
          data: [], // collected x-axis values
          fill: true,
          backgroundColor: 'rgba(255, 0, 255, 0.75)',
          borderColor: '#6610f2'
        },
        {
          label: 'y',
          data: [], // collected y-axis values
          fill: true,
          backgroundColor: 'rgba(0, 255, 0, 0.75)',
          borderColor: 'rgb(34,139,34)'
        },
        {
          label: 'z',
          data: [], // collected z-axis values
          fill: true,
          backgroundColor: 'rgba(0, 0, 255, 0.75)',
          borderColor: 'rgba(255, 0, 255, 0.75)'
        }
      ]
    }
    this.time = Date.now() // set initial time to make timestamps
    this.latency = 0 // to specify intervals between data points
  }

  chart = {} // What is this doing here? It's initializing a variable to hold the graph generated when initalizeChart is called.

  componentDidMount() {
    this.props.addChart() // Add new chart to DB (add new table to DB to be populated with chart data)
    this.initializeChart({
      // Invokes initializeChart which creates new chart using these options:
      //
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

  // Currently the data is retrieved whenever the page re-renders
  // The data is being passed in as props from the redux store.
  // The loop is to push this data into the local state for it to render on the chart.
  // The data is pushed for one ip call at a time, meaning this.props.data (the store) only has one set of x,y, and z values at any moment.
  componentDidUpdate = () => {
    this.data.labels.push(Date.now() - this.time)
    this.data.datasets.forEach(dataset => {
      switch (dataset.label) {
        case 'x':
          dataset.data.push(this.props.data.x)
          break
        case 'y':
          dataset.data.push(this.props.data.y)
          break
        case 'z':
          dataset.data.push(this.props.data.z)
          break
        default:
          console.log("How'd I get here?")
      }
    })
    this.chart.update() // Required to dynamically render the chart. It in turn causes a re-render.
  }

  initializeChart(options) {
    let ctx = this.chartRef.current.getContext('2d') // context, used in creating a canvas element
    this.chart = new Graph(ctx, options) // using the chart.js library, create a new chart with chart options given when this function is invoked
  }

  //  Depending on logic: Start recording or use the save feature
  // Currently save function only calculates the time between data points collected
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
    const timeDiff = this.data.labels.map((timestamp, idx) => {
      if (idx + 1 === this.data.labels.length) {
        return timestamp - this.data.labels[idx - 1]
      } else return this.data.labels[idx + 1] - timestamp
    })
    const avgLatency =
      timeDiff.reduce((acc, timeDelta) => acc + timeDelta, 0) / timeDiff.length
    this.latency = avgLatency
    return avgLatency
  }

  render() {
    // Check at each render if recording. getData makes an axios call to the DB
    // It updates the chart with the new data that arrived. It stores that chart in the store.
    // Storing the whole chart in the store is unneccesary because the chart gets its data from the local state.
    // See proposal within /store/data.js
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
