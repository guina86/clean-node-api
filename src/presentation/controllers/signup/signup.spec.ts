import { SignUpController } from './signup'
import { ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation } from './signup-protocols'

class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return makeFakeAccount()
  }
}

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

const addAccountStub = new AddAccountStub()
const validationStub = new ValidationStub()

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeSut = (): SignUpController => {
  return new SignUpController(addAccountStub, validationStub)
}

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const sut = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async (account: AddAccountModel) => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 if valid data is provided', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeAccount())
  })

  it('should call Validation with correct values', async () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if validation returns an error', async () => {
    const sut = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('any_error'))
  })
})
