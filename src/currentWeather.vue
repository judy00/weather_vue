<template lang="pug">
  section#current-weather-container.inline-block
    h2#current-weather-title.deep-gary-title(v-show='display')
      | Weather in {{currInfo.city}}, {{currInfo.country}}
      span#current-weather-city
      span#current-weather-country
    img#current-weather-image(alt='weatherIcon' :src='currInfo.currImg' v-show='display')
    h2#current-weather-temp.deep-gary-title.inline-block {{currInfo.currTemp}}
    p#current-descrip-text {{currInfo.currDescrip}}
    p#current-descrip-time {{currInfo.currTime}}
    table#current-weather-table(v-show='display')
      template(v-for='item in currTable')
        tr
          td {{item.prop}}
          td {{item.value}}
</template>

<script>
export default {
  props: [
    'currTable',
    'display',
    'currInfo'
  ]
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
