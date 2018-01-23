<template lang="pug">
  section#Hourly.tab-content
    table#fore-weather-hourly-table
      template(v-for='(item, index) in foreHourlyTable')
        tr(v-if='index === 0')
          td.hourly-date-td(colspan='2')
            strong {{item.timeDmdy}} {{'Today'}}
        tr
          td.hourly-info-td
            span {{item.timeHm}}
            img(alt='weatherIcon' :src='item.icon')
          td.hourly-info-td
            p
              span.hourly-temp {{item.temp}}
              em {{item.descrip}}
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
