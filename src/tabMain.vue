<template lang="pug">
  section#Main.tab-content
    section#chart-container.fore-main-chart-container
    section#fore-main-info-container
      template(v-for='item in foreMainTable')
        section.fore-main-info.inline-block
          img.fore-main-img(alt='weatherIcon' v-bind:src='item.icon')
          p.fore-main-temp {{item.temp}}
          p.fore-main-wind {{item.wind}}
          p.fore-main-hpa.color-light-gray {{item.hpa}}
</template>

<script>
export default {
  props: [
    'foreMainTable'
  ]
}
</script>

<style lang="scss">
</style>
