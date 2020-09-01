import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialog:{
      open:false,
      mess:"Cargando valor de dolar"


    }
  },
  mutations: {
    async  OpenLoading(state, data) {
     state.dialog.open=!state.dialog.open;
     state.dialog.mess=data;
    },
    async  CloseLoading(state, data) {
      state.dialog.open=!state.dialog.open;
      state.dialog.mess=data;
     },
  },
  actions: {
  },
  modules: {
  }
})
