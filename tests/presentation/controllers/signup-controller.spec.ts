import { SignUpController, SignUpControllerRequest } from '../../../src/presentation/controllers'
import { EmailInUseError, ServerError } from '../../../src/presentation/errors'
import { mockAddAccount, mockAuthentication, mockValidation } from '../mocks'

const mockRequest = (): SignUpControllerRequest => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const addAccountStub = mockAddAccount()
const validationStub = mockValidation()
const authenticationStub = mockAuthentication()

const makeSut = (): SignUpController => new SignUpController(addAccountStub, validationStub, authenticationStub)

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const sut = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())
    const request = mockRequest()
    const httpResponse = await sut.handle(request)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if Authentication throws', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 403 if AddAccount return false', async () => {
    const sut = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(false)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new EmailInUseError())
  })

  it('should return 200 if valid data is provided', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token', name: 'any_name' })
  })

  it('should call Validation with correct values', async () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('should return 400 if validation returns an error', async () => {
    const sut = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('any_error'))
  })

  it('should call Authentication with correct values', async () => {
    const sut = makeSut()
    const auth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(auth).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
})
