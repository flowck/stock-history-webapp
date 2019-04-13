import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import vueAxios from "vue-axios";
// Custom plugins / components
import Chart from "v-chart-plugin";

// Configs
Vue.use(vueAxios, axios);
Vue.use(Chart);
Vue.config.productionTip = false;

// Set default configuration of axios
axios.defaults.baseURL = process.env.VUE_APP_API;
axios.defaults.headers.post["Content-Type"] = "application/json";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
