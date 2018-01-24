<template lang="pug">
  section#Hourly.tab-content
    table#fore-weather-hourly-table
      template(v-for='(item, index) in foreHourlyTable')
        tr(v-if='index === 0')
          td.hourly-date-td(colspan='2')
            strong {{ item.timeDmdy }} {{ 'Today' }}
        tr
          td.hourly-info-td
            span {{ item.timeHm }}
            img(alt='weatherIcon', :src='item.icon')
          td.hourly-info-td
            p
              span.hourly-temp {{ item.temp }}
              em {{ item.descrip }}
            p {{ item.hourlyDetail }}
        tr(v-if='item.displayHourlyDateRow')
          td.hourly-date-td(colspan='2')
            strong {{ item.timeDmdy }}
</template>

<script>
export default {
  props: [
    'foreHourlyTable'
  ]
}
</script>

<style lang="scss">
@import "styles/variables";

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
