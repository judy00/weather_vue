<template lang="pug">
  section#Hourly.tab-content
    h3#fore-weather-subtitle
     | Weather and forecasts in {{ data.city.name }}, {{ data.city.country }}
    table#fore-weather-hourly-table
      tr
        td.hourly-date-td(colspan='2')
          strong {{ data.list[0].dt | date }} Today
      template(v-for='item in list')
        tr(v-if='item.isDate')
          td.hourly-date-td(colspan='2')
            strong {{ item.day }}
        tr(v-else)
          td.hourly-info-td
            span {{ item.dt | hour }}
            img(alt='weatherIcon', :src='`https://openweathermap.org/img/w/${item.weather[0].icon}.png`')
          td.hourly-info-td
            p
              span.hourly-temp {{ item.main.temp.toFixed(1) }} {{degree}}
              em {{ item.weather[0].description }}
            p {{item.wind.speed}}, m/h  clouds: {{item.clouds.all}}%, {{item.main.pressure}} hpa
</template>

<script>
import moment from 'moment'

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          name: '',
          country: '',
          city: {},
          list: [{}],
          dt: ''
        }
      }
    },
    degree: {
      type: String
    }
  },
  data () {
    return {
      list: []
    }
  },
  filters: {
    date (rawTime) {
      return moment(rawTime * 1000).format('ddd MMM DD YYYY')
    },
    hour (rawTime) {
      return moment(rawTime * 1000).format('HH:mm')
    }
  },
  watch: {
    data () {
      this.list.splice(0)
      this.diffDay()
    }
  },
  methods: {
    diffDay: function () {
      this.list.splice(0)
      if (this.data.list !== undefined) {
        this.data.list.forEach((item, index, array) => {
          if (index < array.length - 1 && !moment(item.dt * 1000).isSame(array[index + 1].dt * 1000, 'day')) {
            this.list.push(item, { isDate: true, day: moment(array[index + 1].dt * 1000).format('ddd MMM DD YYYY') })
          } else {
            this.list.push(item)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/variables";

#fore-weather-subtitle {
  @include text(18px, $title-deep-gray)
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

</style>
