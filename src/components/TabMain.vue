<template lang="pug">
  section#Main.tab-content
    h3#fore-weather-subtitle
     | Weather and forecasts in {{ data.city.name }}, {{ data.city.country }}
    section#chart-container.fore-main-chart-container
    section#fore-main-info-container
      section.fore-main-info.inline-block(v-for="(item, idx) in list")
        img.fore-main-img(alt="weatherIcon", :src="imgSrc(item.weather[0].icon)")
        p.fore-main-temp {{ item.main.temp }} {{degree}}
        p.fore-main-wind {{ item.wind.speed }} m/s
        p.fore-main-hpa.color-light-gray {{ item.main.pressure }}
</template>

<script>

import moment from 'moment'
import Highcharts from 'highcharts'
import chartObj from '@/chartObject'
import { imgSrc } from '@/constants'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['data', 'degree']),
    list () {
      return this.$store.state.data.list.slice(0, 10)
    }
  },
  methods: {
    buildMainChart (apiData, degree) {
      const config = JSON.parse(JSON.stringify(chartObj))
      config.yAxis[0].labels.formatter =
        function () {
          return Math.round(this.value) + degree
        }
      for (let i = 0; i < 10; i++) {
        const data = apiData[i]
        config.xAxis.categories.push(moment(data.dt * 1000).format('HH:mm'))
        config.series[1].data.push(parseFloat(data.main.temp))
        if (data.hasOwnProperty('rain') && data.rain.hasOwnProperty('3h')) {
          for (let item in data.rain) {
            config.series[0].data.push(data.rain[item].toFixed(1) * 1)
          }
        } else {
          config.series[0].data.push(0)
        }
      }
      Highcharts.chart('chart-container', config)
    },
    imgSrc (icon) {
      return `${imgSrc}${icon}.png`
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
