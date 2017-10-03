import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/lib/Auth'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Classroom from '../pages/Classroom'
import Courses from '../pages/Courses'

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
    },
    {
      path: '/classroom/:slug',
      name: 'classroom',
      component: Classroom
    },
    {
      path: '/courses',
      name: 'courses',
      component: Courses
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
