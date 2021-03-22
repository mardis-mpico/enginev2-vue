import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import {LDrawToolbar} from 'vue2-leaflet-draw-toolbar';
// ...

Vue.use(Vuex);
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-draw-toolbar', LDrawToolbar);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ["auth"],
});

import auth from "@/modules/authentication";

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    error: false,
    errorMessage: "",
    toggleState: true,
    showHomeContent: true, 
  },
  getters: {
    toggleDrawer(state) {
      return state.toggleState;
    },
    getUserData(state){
      return state.user;
    },
    getShowHomeContent(state){
      return state.showHomeContent;
    }
  },
  mutations: {
    setUserData(state, user){
      state.user = user;
    },
    setToggleState(state,bool) {
      state.toggleState = bool;
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
    setError(state, error) {
      state.error = true;
      state.errorMessage = error;
    },
    setShowHomeContent(state){
      state.showHomeContent = false;
    },
    restoreErrors(state) {
      state.error = false;
      state.errorMessage = "";
    },
  },
  modules: {
    auth,
  },
  plugins: [vuexLocal.plugin],
});
