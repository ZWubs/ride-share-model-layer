import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    snackbarText: "",
  },

  getters: {

  },

  mutations: {
    setSnack(state, snack) {
      state.snackbarText = snack;
    }
  }
  
});


/*
export const state = () => ({
  snack: ''
})

export const mutations = {
  setSnack (state, snack) {
    state.snack = snack
  }
}
*/
