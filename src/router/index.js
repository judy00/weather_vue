import Vue from 'vue'
import Router from 'vue-router'
import TabMain from '@/components/TabMain'
import TabHourly from '@/components/TabHourly'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: TabMain
    },
    {
      path: '/main',
      name: 'main',
      component: TabMain
    },
    {
      path: '/hourly',
      name: 'hourly',
      component: TabHourly
    }
  ]
})
