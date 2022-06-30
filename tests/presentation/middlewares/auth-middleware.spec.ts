import { AuthMiddleware, AuthMiddlewareRequest } from '@presentation/middlewares'
import { AccessDeniedError, ServerError } from '@presentation/errors'
import { Middleware } from '@presentation/protocols'
import { LoadAccountByToken } from '@domain/usecases'
import { mockAccountModel } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

const mockRequest = (): AuthMiddlewareRequest => ({ accessToken: 'any_token' })

describe('Auth MIddleware', () => {
  const makeSut = (role?: string): Middleware => new AuthMiddleware(loadAccountByTokenSpy, role)
  const loadAccountByTokenSpy = mock<LoadAccountByToken>()

  beforeAll(() => {
    loadAccountByTokenSpy.load.mockResolvedValue(mockAccountModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should return 403 if no x-access-token existss in header', async () => {
    const sut = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should return 403 if LoadAccountByToken return null', async () => {
    loadAccountByTokenSpy.load.mockResolvedValueOnce(null)
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const error = new Error()
    loadAccountByTokenSpy.load.mockRejectedValueOnce(error)
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(error.stack))
  })

  it('should return 200 if LoadAccountByToken returns an account ', async () => {
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accountId: 'any_id' })
  })

  it('should call LoadAccountByToken with correct acessToken and role', async () => {
    const role = 'any_role'
    const sut = makeSut(role)

    await sut.handle(mockRequest())

    expect(loadAccountByTokenSpy.load).toHaveBeenCalledWith('any_token', role)
  })
})
