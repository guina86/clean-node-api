import { EmailValidation } from '../../../src/validation/validators'
import { InvalidParamError } from '../../../src/presentation/errors'
import { mockEmailValidator } from '../mocks'
import { throwError } from '../../domain/mocks'

const emailValidatorStub = mockEmailValidator()

const makeSut = (): EmailValidation => new EmailValidation('email', emailValidatorStub)

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
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(throwError)

    expect(sut.validate).toThrow()
  })
})
