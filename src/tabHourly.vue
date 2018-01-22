<template lang="pug">
  section#Hourly.tab-content
    table#fore-weather-hourly-table
      template(v-for='(item, index) in foreHourlyTable')
        tr(v-if='index === 0')
          td.hourly-date-td(colspan='2')
            strong {{item.timeDmdy}}
        tr
          td.hourly-info-td
            span {{item.timeHm}}
            img(alt='weatherIcon' :src='item.weather[0].icon')
          td.hourly-info-td
            p
              span.hourly-temp {{item.main.temp}}
              em {{item.weather[0].description}}
            p {{item.hourlyDetail}}
        tr(v-if='item.displayHourlyDateRow')
          td.hourly-date-td(colspan='2')
            strong {{item.timeDmdy}}
</template>

<script>
export default {
  props: [
    'foreHourlyTable'
  ]
}
</script>

<style lang="scss">
</style>
