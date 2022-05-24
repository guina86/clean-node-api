import { AuthenticationModel } from '../../../src/domain/models'
import { Authentication, AuthenticationParams } from '../../../src/domain/usecases'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return { accessToken: 'any_token', name: 'any_name' }
    }
  }
  return new AuthenticationStub()
}
