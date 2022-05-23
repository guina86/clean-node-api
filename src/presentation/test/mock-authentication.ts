import { AuthenticationModel } from '../../domain/models'
import { Authentication, AuthenticationParams } from '../../domain/usecases'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return { accessToken: 'any_token', name: 'any_name' }
    }
  }
  return new AuthenticationStub()
}
