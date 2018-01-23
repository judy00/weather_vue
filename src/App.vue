<template lang="pug">
  div#app
    main
      section#search-bar-container
        form
          input#input-city-name.search-bar-item-style(type='text' placeholder='Your city name' v-model='inputCity')
          input#search-city-button.search-bar-item-style(type='button' value='search' @click='search')
          label#temp-switch-btn
            input#temp-check-box(type='checkbox' v-model='tempSwitch' @click='search')
            span#temp-slider.round
            span#temp-unit °C　°F
      section#weather-data-container
        currentWeather(v-bind:display='display'
                       v-bind:info='currInfo'
                       v-bind:table='currTable'
                      )
        section#forecast-weather-container.inline-block
          h2#fore-weather-title(v-show='display') Current weather and forecasts in your city
          ul#fore-tab-list(v-show='display')
            li.inline-block
              a#forecast-tab-main.forecast-tab(href='#' @click="content='tabMain'") Main
            li.inline-block
              a#forecast-tab-hourly.forecast-tab(href='#' @click="content='tabHourly'") Hourly
          h3#fore-weather-subtitle(v-show='display')
            | Weather and forecasts in {{currInfo.city}}, {{currInfo.country}}
            span#fore-weather-city
            span#fore-weather-country
            keep-alive
              component(v-bind:is='content' v-bind="tabProps")
              //- tabMain(v-bind:foreMainTable='foreMainTable')
              //- tabHourly(v-bind:foreHourlyTable='foreHourlyTable')
    img(src='./assets/logo.png')
    router-view
</template>

<script>

import axios from 'axios'
import moment from 'moment'
import Highcharts from 'highcharts'
import chartObj from './chartObject'
import currentWeather from './currentWeather.vue'
import tabMain from './tabMain.vue'
import tabHourly from './tabHourly.vue'

export default {
  name: 'app',
  components: {
    currentWeather: currentWeather,
    tabMain: tabMain,
    tabHourly: tabHourly
  },
  data () {
    return {
      inputCity: '',
      tempSwitch: false,
      display: false,
      content: 'tabMain',
      tabProps: {foreMainTable: ''},
      currInfo: {
        city: '',
        country: '',
        img: '',
        temp: '',
        descrip: '',
        time: ''
      },
      currTable: [
        {prop: 'Wind', value: ''},
        {prop: 'Cloudiness', value: ''},
        {prop: 'Pressure', value: ''},
        {prop: 'Humidity', value: ''},
        {prop: 'Sunrise', value: ''},
        {prop: 'Sunset', value: ''},
        {prop: 'Coord', value: ''}
      ],
      foreHourlyTable: [],
      foreMainTable: []
    }
  },
  watch: {
    tempSwitch () {
      this.search()
    },
    content () {
      if (this.content === 'tabMain') {
        this.tabProps = { foreMainTable: this.foreMainTable }
      } else {
        this.tabProps = { foreHourlyTable: this.foreHourlyTable }
      }
    }
  },
  methods: {
    search: function () {
      const degrees = this.tempSwitch ? ' °F' : ' °C'

      Promise.all([
        axios.get('http://api.openweathermap.org/data/2.5/weather?', {
          params: {
            q: this.inputCity,
            units: this.tempSwitch ? 'imperial' : 'metric',
            APPID: '9c8dadba0d86fe1e366e1e7781cdfc59'
          }
        }),
        axios.get('http://api.openweathermap.org/data/2.5/forecast?', {
          params: {
            q: this.inputCity,
            units: this.tempSwitch ? 'imperial' : 'metric',
            APPID: '9c8dadba0d86fe1e366e1e7781cdfc59'
          }
        })
      ])
        .then(([{data: acct}, {data: perms}]) => {
          this.showElement()
          this.currentData(acct, degrees)
          this.forecastData(perms, degrees)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    showElement: function () {
      this.display = true
    },
    currentData: function (apiData, degrees) {
      const currTableData = [
        apiData.wind.speed + 'm/s, ' + apiData.wind.deg,
        'Broken clouds',
        apiData.main.pressure + ' hpa',
        apiData.main.humidity + ' %',
        moment(apiData.sys.sunrise * 1000).format('HH:mm'),
        moment(apiData.sys.sunset * 1000).format('HH:mm'),
        '[ ' + apiData.coord.lat + ', ' + apiData.coord.lon + ' ]'
      ]

      this.currInfo.city = apiData.name
      this.currInfo.country = apiData.sys.country
      this.currInfo.img = 'https://openweathermap.org/img/w/' + apiData.weather[0].icon + '.png'
      this.currInfo.temp = parseInt(apiData.main.temp) + degrees
      this.currInfo.descrip = apiData.weather[0].description
      this.currInfo.time = moment(apiData.dt * 1000).format('HH:mm MMM DD')
      this.currTable.forEach((item, index) => { item.value = currTableData[index] })
    },
    forecastData: function (apiData, degrees, chartObject) {
      this.foreHourlyTable = apiData.list.map((item, index, array) => {
        item.weather[0].icon = 'https://openweathermap.org/img/w/' + item.weather[0].icon + '.png'
        item.main.temp = item.main.temp.toFixed(1) + degrees
        item.timeHm = moment(item.dt * 1000).format('HH:mm')
        item.hourlyDetail = item.wind.speed + ', m/s   ' + 'clouds: ' + item.clouds.all + '%,  ' + item.main.pressure + ' hpa'
        array[0].timeDmdy = moment(array[0].dt * 1000).format('ddd MMM DD YYYY')

        if (index < array.length - 1 && !moment(item.dt * 1000).isSame(array[index + 1].dt * 1000, 'day')) {
          item.displayHourlyDateRow = true
          item.timeDmdy = moment(array[index + 1].dt * 1000).format('ddd MMM DD YYYY')
        } else {
          item.displayHourlyDateRow = false
        }

        return item
      })

      for (let i = 0; i < 10; i++) {
        const data = apiData.list[i]
        this.foreMainTable[i] = {}
        this.foreMainTable[i].icon = data.weather[0].icon
        this.foreMainTable[i].wind = data.wind.speed + ' m/s'
        this.foreMainTable[i].hpa = data.main.pressure
        this.foreMainTable[i].temp = data.main.temp
      }

      this.tabProps.foreMainTable = this.foreMainTable
      this.buildMainChart(apiData.list, degrees, chartObj)
    },
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
$deep-orange: #d26c22;
$table-border-gray: #d5d5d5;
$table-row-gray: #f0f0f0;
$title-deep-gray: #646464;
$tab-gray: #868686;
$hourly-temp-gray: #999999;
$main-hpa-gray: #808080;
$temp-slider-orange: #ef9b74;

@mixin text($size, $color) {
  font-size: $size;
  color: $color;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

* {
  box-sizing: border-box;
  text-decoration-line: none;
}

html, body {
  margin: 0;
}

.deep-gary-title {
  @include text(23px, $title-deep-gray)
  vertical-align: top;
}

.inline-block {
  display: inline-block;
}

#search-bar-container {
  text-align: center;
  form {
    position: relative;
    margin: 0px auto;
    width: 500px;
  }
}

#search-city-button {
  color: white;
  margin-left: 5px;
  background-color: $deep-orange;
}

.search-bar-item-style {
  height: 35px;
  border-radius: 5px;
  vertical-align: middle;
  border: 1px solid $deep-orange;
}

#weather-data-container {
  margin: 50px auto 100px auto;
  width: 1000px;
  min-width: 950px;
}

#fore-weather-title {
  @include text(23px, $deep-orange)
}

#fore-weather-subtitle {
  @include text(18px, $title-deep-gray)
}

#fore-tab-list {
  padding: 0px;
  margin-bottom: 26px;
}

.forecast-tab {
  color: $tab-gray;
  padding: 8px;
  margin: 0px 2px;
  border-bottom: 1px solid $tab-gray;
  &:hover {
    color: $title-deep-gray;
    border-bottom: 1px solid $deep-orange;
    transition: 0.5s;
  }
  &:active {
    color: $deep-orange;
    border-bottom: 1px solid $deep-orange;
  }
}

#forecast-weather-container {
  vertical-align: top;
  min-width: 700px;
  table {
    @include text(14px, $title-deep-gray)
    margin-top: 10px;
    width: 750px;
    border-collapse: collapse;
  }
  img {
    vertical-align: middle;
    margin-left: 5px;
  }
}

.hourly-date-td {
  padding: 10px 15px;
  border: 1px solid $table-border-gray;
  background-color: $table-row-gray;
}

.hourly-info-td {
  padding: 0px 15px;
  vertical-align: middle;
  border-bottom: 1px solid $table-border-gray;
}

.hourly-temp {
  @include text(11px, white)
  padding: 3px 10px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: $hourly-temp-gray;
}

// .tab-content {
//   display: none;
// }

// .tab-content-show {
//   display: block;
// }

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

#temp-switch-btn {
  position: absolute;
  top: 0px;
  right: 50px;
  width: 60px;
  height: 34px;
  input {
    display: none;
  }
}

#temp-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $table-border-gray;
  transition: .4s;
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: $temp-slider-orange;
    -webkit-transition: .4s;
    transition: .4s;
  }
  &.round {
    border-radius: 34px;
    &:before {
      border-radius: 50%;
    }
  }
}

#temp-unit {
  @include text(13px, white)
  position: absolute;
  left: 10px;
  line-height: 35px;
}

input:checked + #temp-slider:before {
  -webkit-transform: translateX(26px);
  transform: translateX(26px);
}

</style>
