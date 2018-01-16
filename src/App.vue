<template lang="pug">
  div#app
    main
      section#search-bar-container
        form
          input#input-city-name.search-bar-item-style(type='text' placeholder='Your city name' v-model='inputCity')
          input#search-city-button.search-bar-item-style(type='button' value='search' @click='search() + showElement()')
          label#temp-switch-btn
            input#temp-check-box(type='checkbox' v-model='tempSwitch')
            span#temp-slider.round
            span#temp-unit °C　°F
      section#weather-data-container
        section#current-weather-container.inline-block
          h2#current-weather-title.deep-gary-title(v-show='display')
            | Weather in {{city}}, {{country}}
            span#current-weather-city
            span#current-weather-country
          img#current-weather-image(alt='weatherIcon' v-bind:src='currImg' v-show='display')
          h2#current-weather-temp.deep-gary-title.inline-block {{currTemp}}
          p#current-descrip-text {{currDescrip}}
          p#current-descrip-time {{currTime}}
          table#current-weather-table(v-show='display')
            template(v-for='item in currTable')
              tr
                td {{item.prop}}
                td {{item.value}}
        section#forecast-weather-container.inline-block
          h2#fore-weather-title(v-show='display') Current weather and forecasts in your city
          ul#fore-tab-list(v-show='display')
            li.inline-block
              a#forecast-tab-main.forecast-tab(href='#' @click='showTabContent') Main
            li.inline-block
              a#forecast-tab-hourly.forecast-tab(href='#' @click='showTabContent') Hourly
          h3#fore-weather-subtitle(v-show='display')
            | Weather and forecasts in {{city}}, {{country}}
            span#fore-weather-city
            span#fore-weather-country
          section#Main.tab-content.tab-content-show
            h3(v-show='display') main
            section#chart-container.fore-main-chart-container
            section#fore-main-info-container
              - for(let i = 10; i > 0; i--)
                section.fore-main-info.inline-block
                  img.fore-main-img
                  p.fore-main-temp
                  p.fore-main-wind
                  p.fore-main-hpa.color-light-gray
          section#Hourly.tab-content
            h3(v-show='display') hourly
            table#fore-weather-hourly-table
              template(v-for='item in foreTable')
                tr
                  td.hourly-info-td
                    span {{item.dt1}}
                    img(alt='weatherIcon' :src='item.weather[0].icon')
                  td.hourly-info-td
                    p {{item.dt2}}
                      span.hourly-temp {{item.main.temp}}
                      em {{item.weather[0].description}}
                    p
    h1 {{ msg }}
    img(src='./assets/logo.png')
    router-view
</template>

<script>

import axios from 'axios'
import moment from 'moment'
// import Highcharts from 'highcharts'
// import chartObject from './chartObject'

export default {
  name: 'app',
  data () {
    return {
      msg: 'testtest',
      inputCity: '',
      tempSwitch: false,
      display: false,
      city: '',
      country: '',
      currImg: '',
      currTemp: '',
      currDescrip: '',
      currTime: '',
      currTable: [
        {prop: 'Wind', value: ''},
        {prop: 'Cloudiness', value: ''},
        {prop: 'Pressure', value: ''},
        {prop: 'Humidity', value: ''},
        {prop: 'Sunrise', value: ''},
        {prop: 'Sunset', value: ''},
        {prop: 'Coord', value: ''}
      ],
      foreTable: []
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
          this.currentData(acct, degrees)
          this.forecastData(perms, degrees)
          // this.foreTable = perms.list
          // console.log(this.foreTable)
          // console.log(this.foreTable[0].)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    showElement: function () {
      this.display = true
    },
    showTabContent: function (event) {
      const displayingSection = document.querySelector('.tab-content-show')
      const selectedSection = document.querySelector('#' + event.target.textContent)

      displayingSection.className = displayingSection.className.replace('tab-content-show', '')
      selectedSection.className = selectedSection.className + ' tab-content-show'
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

      this.city = apiData.name
      this.country = apiData.sys.country
      this.currImg = 'https://openweathermap.org/img/w/' + apiData.weather[0].icon + '.png'
      this.currTemp = parseInt(apiData.main.temp) + degrees
      this.currDescrip = apiData.weather[0].description
      this.currTime = moment(apiData.dt * 1000).format('HH:mm MMM DD')
      this.currTable.forEach((item, index) => {
        item.value = currTableData[index]
      })
    },
    forecastData: function (apiData, degrees, chartObject) {
      // this.foreTable.map() =
      this.foreTable = apiData.list.map((item) => {
        // item.dt = moment(item.dt * 1000).format('HH:mm')
        item.weather[0].icon = 'https://openweathermap.org/img/w/' + item.weather[0].icon + '.png'
        item.main.temp = item.main.temp.toFixed(1) + degrees
        item.dt1 = moment(item.dt * 1000).format('HH:mm')
        item.dt2 = moment(item.dt * 1000).format('ddd MMM DD YYYY')
        return item
      })
      // console.log(tempArray)

      // console.log(this.foreTable)
      // this.foreTable.forEach((item, index) => {
      //   item.weather[0].icon = 'https://openweathermap.org/img/w/' + item.weather[0].icon + '.png'
      //   console.log(item.weather[0].icon)
      // })
      // console.log(this.foreTable)
      // console.log(apiData, degrees, chartObject)
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

#current-weather-container {
  @include text(14px, $title-deep-gray)
  min-width: 250px;
  #current-weather-temp {
    margin-top: 11px;
  }
  table {
    border-collapse: collapse;
  }
  td {
    padding : 5px;
    border: 1px solid $table-border-gray;
  }
  tr:nth-child(odd){
    background-color: $table-row-gray;
  }
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

.tab-content {
  display: none;
}

.tab-content-show {
  display: block;
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
    margin: 0px 3.5px;
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
