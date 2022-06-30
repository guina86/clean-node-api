import { EmailValidation } from '@validation/validators'
import { EmailValidator } from '@validation/protocols'
import { InvalidParamError } from '@presentation/errors'
import { throwError } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('EmailValidation', () => {
  const makeSut = (): EmailValidation => new EmailValidation('email', emailValidatorSpy)
  const emailValidatorSpy = mock<EmailValidator>()

  it('should call EmailValidator with correct email', () => {
    const sut = makeSut()

    sut.validate({ email: 'any_email@mail.com' })

    expect(emailValidatorSpy.isValid).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return an error if EmailValidator return false', () => {
    emailValidatorSpy.isValid.mockReturnValueOnce(false)
    const sut = makeSut()

    const error = sut.validate({ email: 'invalid_email' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should throw if email validator throws', () => {
    emailValidatorSpy.isValid.mockImplementationOnce(throwError)
    const sut = makeSut()

    expect(sut.validate).toThrow()
  })
})
