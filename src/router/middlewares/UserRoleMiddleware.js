import Auth from '@/lib/Auth'

export default class UserRoleMiddleware {
  static getUser(next) {
    let user = Auth.getUser()

    if (!user || user === undefined) {
      return next({
        name: 'home'
      })
    }

    return user
  }

  static handleStudent(to, from, next) {
    let user = UserRoleMiddleware.getUser(next)

    if (user.role !== 'student') {
      return next({
        name: 'dashboard'
      })
    }
    return next()
  }

  static handleTutor(to, from, next) {
    let user = UserRoleMiddleware.getUser(next)

    if (user.role !== 'tutor') {
      return next({
        name: 'dashboard'
      })
    }
    return next()
  }
}
