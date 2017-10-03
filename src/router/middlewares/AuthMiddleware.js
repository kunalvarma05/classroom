import Auth from '@/lib/Auth'

export default class AuthMiddleware {

  static handleAuth(to, from, next) {
    if (!Auth.isAuthenticated()) {
      return next({
        name: 'home'
      })
    }
    return next()
  }

  static handleNoAuth(to, from, next) {
    if (!Auth.isAuthenticated()) {
      return next()
    }

    return next({
      name: 'dashboard'
    })
  }
}
