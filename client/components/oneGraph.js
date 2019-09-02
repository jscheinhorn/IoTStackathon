import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Chart} from 'chart.js' // chart.js refers to the library
import {getChartThunk} from '../store'
import {CSVLink} from 'react-csv'

// For notes on chart.js (library) specific code, see chart.js component.
class OneGraphComponent extends Component {
  constructor(props) {
    super(props)
    this.graphId = props.match.params.graphId
    this.chartRef = React.createRef()
    this.state = {
      exportArr: [],
      mount: 0
    }
    this.chart = {}
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
  }

  componentDidMount() {
    this.props.getGraph(this.graphId)
    this.setState({mount: this.state.mount + 1})

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

  initializeChart(options) {
    let ctx = this.chartRef.current.getContext('2d')
    this.chart = new Chart(ctx, options)
  }

  exportCSV = () => {
    let exportArr1 = [
      ['Graph_ID', `${this.props.chart.data.id}`],
      [
        'Date',
        `${this.props.chart.data.createdAt.substring(0, 10)}`,
        'Time (UTC)',
        `${this.props.chart.data.createdAt.substring(
          11,
          `${this.props.chart.data.createdAt.length - 1}`
        )}`
      ],
      ['t (ms)', 'x (g)', 'y (g)', 'z (g)']
    ]
    this.props.chart.data.data.forEach(dataPt => {
      exportArr1.push([dataPt.t, dataPt.x, dataPt.y, dataPt.z])
    })
    this.setState({exportArr: exportArr1}, () => {
      this.csvLink.link.click()
    })
  }

  render() {
    const divStyle = {position: 'relative', height: '100px'}
    if (this.props.chart.data && !this.data.labels.length) {
      this.props.chart.data.data.forEach(dataPt => {
        this.data.labels.push(dataPt.t)
        this.data.datasets[0].data.push(dataPt.x)
        this.data.datasets[1].data.push(dataPt.y)
        this.data.datasets[2].data.push(dataPt.z)
      })

      if (this.state.mount) {
        this.chart.update()
      }
    }

    return (
      <div>
        <h1>{`Graph ${this.graphId} Data`}</h1>
        <div className="chart-container" style={divStyle}>
          <canvas ref={this.chartRef} height="110px" />
          {Object.keys(this.props.chart).length && this.props.chart.data ? (
            <div>
              <button type="button" onClick={this.exportCSV}>
                Download CSV
              </button>
              <CSVLink
                className="hidden"
                data={this.state.exportArr}
                filename={`Graph_${
                  this.graphId
                }_${this.props.chart.data.createdAt.substring(0, 10)}.csv`}
                ref={r => (this.csvLink = r)}
                target="_blank"
              />
            </div>
          ) : (
            <b>! There is no data available for this graph ID !</b>
          )}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getGraph: graphId => dispatch(getChartThunk(graphId))
})

const mapStateToProps = state => ({
  chart: state.chart.chart
})

const Graph = connect(mapStateToProps, mapDispatchToProps)(OneGraphComponent)

export default Graph
