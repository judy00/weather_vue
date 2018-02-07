import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    degree: '',
    data: {
      list: [],
      city: {
        name: '',
        country: ''
      }
    }
  },
  mutations: {
    setData (state, {data, degree}) {
      state.data = data
      state.degree = degree
    }
  },
  actions: {
    getData ({commit}, payload) {
      commit('setData', payload)
    }
  }
})
