import { makeDbLoadAccountByToken } from '@main/factories/usecases'
import { AuthMiddleware } from '@presentation/middlewares'
import { Middleware } from '@presentation/protocols'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
