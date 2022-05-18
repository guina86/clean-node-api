import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError, ServerError } from '../errors'
import { HttpRequest, Middleware } from '../protocols'
import { AccountModel } from '../../domain/models'
import { LoadAccountByToken } from '../../domain/usecases'

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    return makeFakeAccount()
  }
}

const loadAccountByTokenStub = new LoadAccountByTokenStub()

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
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
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const sut = makeSut()
    const error = new Error()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(error)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(error.stack))
  })

  it('should return 200 if LoadAccountByToken returns an account ', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accountId: 'valid_id' })
  })

  it('should call LoadAccountByToken with correct acessToken and role', async () => {
    const role = 'any_role'
    const sut = makeSut(role)
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', role)
  })
})
