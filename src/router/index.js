import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ]
})
