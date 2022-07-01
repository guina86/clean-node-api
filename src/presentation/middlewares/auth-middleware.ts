import { AccessDeniedError } from '@presentation/errors'
import { forbidden, ok, serverError } from '@presentation/helpers'
import { HttpResponse, Middleware } from '@presentation/protocols'
import { LoadAccountByToken } from '@domain/usecases'

export type AuthMiddlewareRequest = {
  accessToken?: string
}

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddlewareRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (!accessToken) return forbidden(new AccessDeniedError())
      const account = await this.loadAccountByToken.load(accessToken, this.role)
      if (!account) return forbidden(new AccessDeniedError())
      return ok({ accountId: account.id })
    } catch (error) {
      return serverError(error)
    }
  }
}
