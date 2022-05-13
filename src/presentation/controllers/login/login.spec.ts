import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AuthenticationStub implements Authentication {
  async auth (email: string, password: string): Promise<string> {
    return 'any_token'
  }
}

const emailValidatorStub = new EmailValidatorStub()
const authenticationStub = new AuthenticationStub()

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeSut = (): LoginController => new LoginController(emailValidatorStub, authenticationStub)

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should call EmailValidator with correct email', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return 400 if email is invalid', async () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should return 500 if EmailValidator throws', async () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('email'))
  })

  it('should call Authentication with correct values', async () => {
    const sut = makeSut()
    const auth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(auth).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
})
