import Vue from "vue";
import Router from "vue-router";
// Import Views
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    }
  ]
});
