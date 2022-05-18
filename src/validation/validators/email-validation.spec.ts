import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols'
import { InvalidParamError } from '../../presentation/errors'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const emailValidatorStub = new EmailValidatorStub()

const makeSut = (): EmailValidation => {
  return new EmailValidation('email', emailValidatorStub)
}

describe('Email Validation', () => {
  it('should call EmailValidator with correct email', () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return an error if EmailValidator return false', () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'invalid_email' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should throw if email validator throws', () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
