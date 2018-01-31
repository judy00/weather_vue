<template lang="pug">
  section#Main.tab-content
    h3#fore-weather-subtitle
     | Weather and forecasts in {{ data.city.name }}, {{ data.city.country }}
    section#chart-container.fore-main-chart-container
    section#fore-main-info-container
      section.fore-main-info.inline-block(v-for="(item, idx) in list")
        img.fore-main-img(alt="weatherIcon", :src="`https://openweathermap.org/img/w/${item.weather[0].icon}.png`")
        p.fore-main-temp {{ item.main.temp }} {{degree}}
        p.fore-main-wind {{ item.wind.speed }} m/s
        p.fore-main-hpa.color-light-gray {{ item.main.pressure }}
</template>

<script>

import moment from 'moment'
import Highcharts from 'highcharts'
import chartObj from '@/chartObject'

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          city: {},
          list: [],
          weather: []
        }
      }
    },
    degree: {
      type: String
    }
  },
  computed: {
    list () {
      return this.data.list.slice(0, 10)
    }
  },
  methods: {
    buildMainChart (apiData) {
      const config = JSON.parse(JSON.stringify(chartObj))

      config.yAxis[0].labels.formatter =
        function () {
          return Math.round(this.value) + this.degree
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
@import "src/styles/variables";

#fore-weather-subtitle {
  @include text(18px, $title-deep-gray)
}

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
    width: 10%;
  }
  .color-light-gray {
    color: $main-hpa-gray;
  }
}
</style>
