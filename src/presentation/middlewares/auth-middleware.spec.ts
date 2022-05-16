import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors'

describe('Auth MIddleware', () => {
  it('should return 403 if no x-access-token existss in header', async () => {
    const sut = new AuthMiddleware()

    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })
})
