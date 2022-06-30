import { LoginController, LoginControllerRequest } from '@presentation/controllers'
import { ServerError, UnauthorizedError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { Authentication } from '@domain/usecases'
import { mock } from 'jest-mock-extended'

const mockRequest = (): LoginControllerRequest => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Login Controller', () => {
  const makeSut = (): LoginController => new LoginController(authenticationSpy, validationSpy)
  const authenticationSpy = mock<Authentication>()
  const validationSpy = mock<Validation>()

  beforeAll(() => {
    authenticationSpy.auth.mockResolvedValue({ accessToken: 'any_token', name: 'any_name' })
  })

  beforeEach(jest.clearAllMocks)

  it('should return 500 if Authentication throws', async () => {
    authenticationSpy.auth.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call Authentication with correct values', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())

    expect(authenticationSpy.auth).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  it('should return 401 if invalid credentials are provided', async () => {
    authenticationSpy.auth.mockResolvedValueOnce(null)
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 200 if valid credentials are provided', async () => {
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token' , name: 'any_name' })
  })

  it('should call Validation with correct values', async () => {
    const sut = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(validationSpy.validate).toHaveBeenCalledWith(request)
  })

  it('should return 400 if validation returns an error', async () => {
    validationSpy.validate.mockReturnValueOnce(new Error('any_error'))
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('any_error'))
  })
})
