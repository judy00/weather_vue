const chartObject = {
  chart: {
    renderTo: 'container',
    type: 'column'
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: []
  },
  yAxis: [{
    title: {
      text: ''
    },
    opposite: true,
    tickInterval: 2,
    tickAmount: 4,
    labels: {
      formatter: {},
      style: {
        color: '#0000ff'
      }
    }
  }, {
    title: {
      text: ''
    },
    opposite: true,
    tickAmount: 4,
    labels: {
      formatter: function () {
        return Math.round(this.value) + 'mm'
      },
      style: {
        color: '#889bbe'
      }
    }
  }],
  tooltip: {
    shared: true,
    borderColor: '#a0a0a0'
  },
  legend: {
    layout: 'vertical',
    align: 'center',
    verticalAlign: 'top',
    x: 120,
    y: 8,
    floating: true,
    itemMarginTop: 2,
    itemMarginBottom: 2,
    backgroundColor: '#ffffff'
  },
  series: [{
    type: 'column',
    yAxis: 1,
    name: 'Precipitation',
    zIndex: 2,
    color: '#a0a0a0',
    data: []
  }, {
    type: 'spline',
    yAxis: 0,
    name: 'Temperature',
    zIndex: 10,
    color: '#0000ff',
    data: []
  }],
  exporting: {
    buttons: {
      contextButton: {
        text: 'Export',
        x: 4,
        y: 19,
        theme: {
          'stroke-width': 1,
          stroke: '#c8c8c8',
          r: 3,
          states: {
            hover: {
              fill: '#fd8b19'
            },
            select: {
              stroke: '#0000ff',
              fill: '#0fd0ae'
            }
          }
        }
      }
    }
  }
}

export default chartObject
