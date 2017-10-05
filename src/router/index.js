import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Course from '../pages/Course'
import Courses from '../pages/Courses'
import Dashboard from '../pages/Dashboard'
import Classroom from '../pages/Classroom'
import Mappings from './middlewares/mappings'
import Sessions from '../pages/course/Sessions'
import DashboardMain from '../pages/DashboardMain'
import CourseOverview from '../pages/course/Overview'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        middlewares: ['no-auth']
      }
    },
    {
      path: '/app',
      component: Dashboard,
      meta: {
        middlewares: ['auth']
      },
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: DashboardMain
        },
        {
          path: 'classroom/:tutor_id/:course_id',
          name: 'classroom',
          component: Classroom,
        },
        {
          path: 'courses',
          name: 'courses',
          component: Courses,
        },
        {
          path: 'courses/:slug',
          component: Course,
          children: [
            {
              path: '/',
              name: 'show-course',
              component: CourseOverview
            },
            {
              path: 'sessions',
              name: 'course-sessions',
              component: Sessions
            }
          ]
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  to.matched.forEach((route) => {
    if (route.meta &&
      route.meta.middlewares !== undefined &&
      route.meta.middlewares.length
    ) {
      // Loop over all the middlewares of the route
      route.meta.middlewares.forEach((alias) => {
        // If a middleware was found
        let middleware = Mappings[alias]

        if (middleware) {
          // Call the middleware
          return middleware.call(this, to, from, next)
        }
      })
    }
  });
  next()
});

export default router;
