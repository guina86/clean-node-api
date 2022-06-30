import { SignUpController, SignUpControllerRequest } from '@presentation/controllers'
import { EmailInUseError, ServerError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { AddAccount, Authentication } from '@domain/usecases'
import { mock } from 'jest-mock-extended'

const mockRequest = (): SignUpControllerRequest => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('SignUp Controller', () => {
  const makeSut = (): SignUpController => new SignUpController(addAccountStub, validationStub, authenticationStub)
  const addAccountStub = mock<AddAccount>()
  const validationStub = mock<Validation>()
  const authenticationStub = mock<Authentication>()

  beforeAll(() => {
    addAccountStub.add.mockResolvedValue(true)
    authenticationStub.auth.mockResolvedValue({ accessToken: 'any_token', name: 'any_name' })
  })

  beforeEach(jest.clearAllMocks)

  it('should call AddAccount with correct values', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())

    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    addAccountStub.add.mockRejectedValueOnce(new Error())
    const sut = makeSut()
    const request = mockRequest()

    const httpResponse = await sut.handle(request)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if Authentication throws', async () => {
    authenticationStub.auth.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 403 if AddAccount return false', async () => {
    addAccountStub.add.mockResolvedValueOnce(false)
    const sut = makeSut()

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
    const request = mockRequest()

    await sut.handle(request)

    expect(validationStub.validate).toHaveBeenCalledWith(request)
  })

  it('should return 400 if validation returns an error', async () => {
    const sut = makeSut()
    validationStub.validate.mockReturnValueOnce(new Error('any_error'))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('any_error'))
  })

  it('should call Authentication with correct values', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())

    expect(authenticationStub.auth).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
})
