import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/lib/Auth'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'

Vue.use(Router);

const router = new Router({
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

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next();
  }

  if (!Auth.getUser()) {
    next('/');
  } else {
    next();
  }
});

export default router;
