<template lang="pug">
  section#current-weather-container.inline-block(v-if="data.weather.length > 0")
    h2#current-weather-title.deep-gary-title
      | Weather in {{ data.name }}, {{ data.sys.country }}
      span#current-weather-city
      span#current-weather-country
    img#current-weather-image(alt="weatherIcon", :src="`https://openweathermap.org/img/w/${data.weather[0].icon}.png`")
    h2#current-weather-temp.deep-gary-title.inline-block {{ parseInt(data.main.temp) }} {{ degree }}
    p#current-descrip-text {{ data.weather[0].description }}
    p#current-descrip-time {{ data.dt | date }}
    table#current-weather-table
      tr
        td Wind
        td {{ data.wind.speed }} m/s, {{ data.wind.deg }}
      tr
        td Cloudiness
        td Broken clouds
      tr
        td Pressure
        td {{ data.main.pressure }} hpa
      tr
        td Humidity
        td {{ data.main.humidity }} %
      tr
        td Sunrise
        td {{ data.sys.sunrise | time }}
      tr
        td Sunset
        td {{ data.sys.sunset | time }}
      tr
        td Coord
        td [ {{ data.coord.lat }} , {{ data.coord.lon }} ]

</template>

<script>
import moment from 'moment'

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          sys: {},
          wind: {},
          main: {},
          coord: {},
          weather: []
        }
      }
    },
    degree: {
      type: String
    }
  },
  filters: {
    time (rawTime) {
      return moment(rawTime * 1000).format('HH:mm')
    },
    date (rawTime) {
      return moment(rawTime * 1000).format('HH:mm MMM DD')
    }
  }
}
</script>

<style lang="scss">
$table-border-gray: #d5d5d5;
$table-row-gray: #f0f0f0;
$title-deep-gray: #646464;

@mixin text($size, $color) {
  font-size: $size;
  color: $color;
}

.deep-gary-title {
  @include text(23px, $title-deep-gray)
  vertical-align: top;
}

.inline-block {
  display: inline-block;
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
</style>
