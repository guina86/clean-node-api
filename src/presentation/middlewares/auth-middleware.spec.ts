import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest, Middleware } from '../protocols'

class LoadAccountByTokenStub implements LoadAccountByToken {
  async loadByToken (accessToken: string): Promise<AccountModel> {
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

const makeSut = (): Middleware => new AuthMiddleware(loadAccountByTokenStub)

describe('Auth MIddleware', () => {
  it('should return 403 if no x-access-token existss in header', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should return 403 if LoadAccountByToken return null', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  it('should call LoadAccountByToken with correct acessToken', async () => {
    const sut = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(makeFakeRequest())
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })
})
