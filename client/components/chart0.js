import React from 'react'
import {connect} from 'react-redux'
import {getDataThunk, addChartThunk} from '../store'
// import {Chart as Graph} from 'chart.js' // Can also get chart from react-chartjs-2
import {Bar, Line, Pie, Chart as Graph} from 'react-chartjs-2'
import ReactDOM from 'react-dom'
let myLineChart

class ChartComponent extends React.Component {
  constructor(props) {
    super(props)
    this.chartRef = React.createRef()
    this.state = {
      renderChart: false,
      record: false
    }
  }

  // chartReference = {
  //   ctx: this.chartRef.current.getContext('2d'),
  //   graph: new Graph(ctx, options)
  // }

  componentDidMount = () => {
    // console.log(this.chartReference) // returns a Chart.js instance reference
    console.log({myLineChart})
    // this.initializeChart(this.config)
  }

  componentDidUpdate() {
    // let lineChart = this.chartReference.chartInstance
    // lineChart.update()
    if (myLineChart !== undefined) {
      myLineChart.data.labels.push(new Date())
      myLineChart.data.datasets.forEach(el => {
        switch (el.label) {
          case 'x':
            myLineChart.data.push(this.props.data.x)
            break
          case 'y':
            myLineChart.data.push(this.props.data.x)
            break
          case 'z':
            myLineChart.data.push(this.props.data.x)
            // console.log(el.data)
            // console.log(this.chartRef)
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
    if (this.chartRef.current) {
      this.buildChart()
    }
    // this.initializeChart(this.config)
  }

  buildChart = () => {
    const myChartRef = this.chartRef.current.getContext('2d')

    if (typeof myLineChart !== 'undefined') {
      myLineChart.destroy()
    }

    myLineChart = new Graph(myChartRef, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'x',
            backgroundColor: 'rgba(255, 0, 255, 0.75)',
            data: []
          },
          {label: 'y', backgroundColor: 'rgba(0, 255, 0, 0.75)', data: []},
          {label: 'z', backgroundColor: 'rgba(0, 0, 255, 0.75)', data: []}
        ]
      },
      options: {
        //Customize chart options
      }
    })
  }

  // initializeChart = options => {
  //   const ctx = this.chartRef.current.getContext('2d')
  //   // let graph = new Graph(ctx, options)
  //   this.graph(ctx, options)
  // }

  startRecording = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({record: !this.state.record})
  }

  render() {
    if (this.state.record) {
      this.props.getData(this.props.ip, this.props.chart.data.id)
      // this.initializeChart(this.config)
      // this.graph.update() // will this even work?
    }
    return (
      <div>
        <h1>This Old Chart</h1>
        <button type="button" onClick={this.handleClick}>
          New Chart
        </button>
        {this.state.renderChart ? (
          <div>
            <div>
              <Line
                options={
                  {responsive: true, maintainAspectRatio: false} // ref={reference => (this.chartReference = reference)}
                }
                data={myLineChart.data}
                ref={this.chartRef}
              />
            </div>
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
})

const Chart = connect(mapStateToProps, mapDispatchToProps)(ChartComponent)

export default Chart

// Need to create a new chart instance
// Need to .update() the chart instance

// changeHandler = event => {
//   console.log('Change handler')
//   this.chart.update()
// }
// this.props.config = line;
// setInterval(function(){
//     this.props.config.labels.push(Math.floor(Math.random() * 100));
//     this.props.config.datasets[0].data.push(Math.floor(Math.random() * 100));
//     this.props.changeHandler();
// }, 5000);

// Originally after render() in conditional
// getData continuously gets data if placed in render, but it is slower than add Data
// this.props.addData(this.props.data, this.props.chart.data.id)

// Removed from dispatch
// addData: (data, id) => dispatch(addDataThunk(data, id))

// let accelerometerChart = new Graph('myChart', {
//   data: {
//     labels: [],
//     datasets: [
//       {
//         label: 'x',
//         backgroundColor: 'rgba(255, 0, 255, 0.75)',
//         data: []
//       },
//       {
//         label: 'y',
//         backgroundColor: 'rgba(0, 255, 0, 0.75)',
//         data: []
//       },
//       {
//         label: 'z',
//         backgroundColor: 'rgba(0, 0, 255, 0.75)',
//         data: []
//       }
//     ]
//   }
// })

// this.graph = (ctx, options) => new Graph(ctx, options)
// this.config = {}
// this.data = {
//   labels: [],
//   datasets: [
//     {label: 'x', backgroundColor: 'rgba(255, 0, 255, 0.75)', data: []},
//     {label: 'y', backgroundColor: 'rgba(0, 255, 0, 0.75)', data: []},
//     {label: 'z', backgroundColor: 'rgba(0, 0, 255, 0.75)', data: []}
//   ]
// }
