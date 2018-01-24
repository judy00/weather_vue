<template lang="pug">
  section#Main.tab-content
    section#chart-container.fore-main-chart-container
    section#fore-main-info-container
      section.fore-main-info.inline-block(v-for='item in foreMainTable')
        img.fore-main-img(alt='weatherIcon', v-bind:src='item.icon')
        p.fore-main-temp {{ item.temp }}
        p.fore-main-wind {{ item.wind }}
        p.fore-main-hpa.color-light-gray {{ item.hpa }}
</template>

<script>

import moment from 'moment'
import Highcharts from 'highcharts'

export default {
  props: [
    'foreMainTable'
  ],
  methods: {
    buildMainChart: function (apiData, degrees, chartObj) {
      const config = JSON.parse(JSON.stringify(chartObj))

      config.yAxis[0].labels.formatter =
        function () {
          return Math.round(this.value) + degrees
        }

      for (let i = 0; i < 10; i++) {
        const data = apiData[i]
        config.xAxis.categories.push(moment(data.dt * 1000).format('HH:mm'))
        config.series[1].data.push(parseFloat(data.main.temp))
        if (data.hasOwnProperty('rain')) {
          for (let item in data.rain) {
            config.series[0].data.push(data.rain[item].toFixed(3) * 1000)
          }
        } else {
          config.series[0].data.push(0)
        }
      }

      Highcharts.chart('chart-container', config)
    }
  }
}
</script>

<style lang="scss">
@import "styles/variables";

#chart-container {
  max-width: 100%;
  height: 250px;
}

#fore-main-info-container {
  margin-left: 8px;
  p {
    text-align: center;
    font-size: 11px;
    margin: 2px 0px;
  }
  .fore-main-info {
    margin: 0px 2.8px;
  }
  .color-light-gray {
    color: $main-hpa-gray;
  }
}
</style>
