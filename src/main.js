import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// Custom plugins / components
import Chart from "v-chart-plugin";

// Configs
Vue.use(Chart);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
