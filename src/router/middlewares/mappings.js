import AuthMiddleware from './AuthMiddleware'
import UserRoleMiddleware from './UserRoleMiddleware'

export default {
  'auth': (to, from, next) => {
    return AuthMiddleware.handleAuth(to, from, next)
  },
  'no-auth': (to, from, next) => {
    return AuthMiddleware.handleNoAuth(to, from, next)
  },
  'role:student': (to, from, next) => {
    return UserRoleMiddleware.handleStudent(to, from, next)
  },
  'role:tutor': (to, from, next) => {
    return UserRoleMiddleware.handleTutor(to, from, next)
  }
}
