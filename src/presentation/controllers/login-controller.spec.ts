import { LoginController } from './login-controller'
import { ServerError, UnauthorizedError } from '../errors'
import { HttpRequest } from '../protocols'
import { mockAuthentication, mockValidation } from '../test'

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const authenticationStub = mockAuthentication()
const validationStub = mockValidation()

const makeSut = (): LoginController => new LoginController(authenticationStub, validationStub)

describe('Login Controller', () => {
  it('should return 500 if Authentication throws', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationStub,'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call Authentication with correct values', async () => {
    const sut = makeSut()
    const auth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(auth).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationStub,'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 200 if valid credentials are provided', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ acessToken: 'any_token' })
  })

  it('should call Validation with correct values', async () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if validation returns an error', async () => {
    const sut = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('any_error'))
  })
})
