<template lang="pug">
  div#app
    main
      section#search-bar-container
        form
          input#input-city-name.search-bar-item-style(type="text", placeholder="Your city name", v-model="inputCity")
          input#search-city-button.search-bar-item-style(type="button", value="search", @click="search")
          ul.sample-city-name
            li(v-for="city in sampleCities", @click="fillInCity(city)") {{ city }}
          label#temp-switch-btn
            input#temp-check-box(type="checkbox", v-model="tempSwitch")
            span#temp-slider.round
            span#temp-unit °C　°F
      section#weather-data-container
        currentWeather(v-show="display", :data="currData", :degree="degree")
        section#forecast-weather-container.inline-block
          h2#fore-weather-title(v-show="display") Current weather and forecasts in your city
          router-link.forecast-tab(to="/main", v-show="display") Main
          router-link.forecast-tab(to="/hourly", v-show="display") Hourly
          keep-alive
            router-view(v-show="display", ref="tabMain")
</template>

<script>

import axios from 'axios'
import currentWeather from '@/components/CurrentWeather.vue'
import { currentSite, foreCastSite, APPID } from './constants'

export default {
  name: 'app',
  components: {
    currentWeather: currentWeather
  },
  data () {
    return {
      inputCity: '',
      tempSwitch: false,
      display: false,
      degree: '',
      currData: undefined,
      sampleCities: ['Taipei', 'Tokyo', 'Beijing']
    }
  },
  watch: {
    tempSwitch () {
      this.search()
    }
  },
  methods: {
    fillInCity (city) {
      this.inputCity = city
      return this.search()
    },
    search () {
      const degrees = this.tempSwitch ? ' °F' : ' °C'
      this.degree = degrees

      Promise.all([
        axios.get(currentSite, {
          params: {
            q: this.inputCity,
            units: this.tempSwitch ? 'imperial' : 'metric',
            APPID
          }
        }),
        axios.get(foreCastSite, {
          params: {
            q: this.inputCity,
            units: this.tempSwitch ? 'imperial' : 'metric',
            APPID
          }
        })
      ])
        .then(([{data: acct}, {data: perms}]) => {
          this.display = true
          this.currData = acct
          this.$store.dispatch({
            type: 'getData',
            data: perms,
            degree: degrees
          })
          this.$router.push({ path: '/main' })
          this.$nextTick(() => {
            this.$refs.tabMain.buildMainChart(perms.list, degrees)
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss">
@import "styles/variables";

* {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  text-decoration-line: none;
}

html, body {
  margin: 40px 0 0 0;
}

.deep-gary-title {
  @include text(23px, $title-deep-gray)
  vertical-align: top;
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
  padding: 0 10px;
}

.sample-city-name {
  color: $sample-text-gray;
  right: 65px;
  bottom: 5px;
  font-size: 14px;
  position: relative;
  list-style-type: none;

  li {
    margin: 10px;
    display:inline;
    cursor: pointer;

    &:hover {
      color: $deep-orange;
      transition: .2s;
    }
  }
}

#weather-data-container {
  margin: 50px auto 100px auto;
  width: 1000px;
  min-width: 950px;
}

#forecast-weather-container {
  vertical-align: top;
  min-width: 700px;
}

#fore-weather-title {
  @include text(23px, $deep-orange)
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
