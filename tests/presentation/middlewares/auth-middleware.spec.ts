import { AuthMiddleware, AuthMiddlewareRequest } from '../../../src/presentation/middlewares'
import { AccessDeniedError, ServerError } from '../../../src/presentation/errors'
import { Middleware } from '../../../src/presentation/protocols'
import { AccountModel } from '../../../src/domain/models'
import { LoadAccountByToken } from '../../../src/domain/usecases'
import { mockAccountModel } from '../../domain/mocks'

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    return mockAccountModel()
  }
}

const loadAccountByTokenStub = new LoadAccountByTokenStub()

const mockRequest = (): AuthMiddlewareRequest => ({
  accessToken: 'any_token'
})

const makeSut = (role?: string): Middleware => new AuthMiddleware(loadAccountByTokenStub, role)

describe('Auth MIddleware', () => {
  it('should return 403 if no x-access-token existss in header', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should return 403 if LoadAccountByToken return null', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const sut = makeSut()
    const error = new Error()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(error)
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
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', role)
  })
})
