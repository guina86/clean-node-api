import { EmailValidatorAdapter } from '@infra/validators'
import { makeSignUpValidation } from '@main/factories'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@validation/validators'

jest.mock('@validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const validations = [
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', new EmailValidatorAdapter())
    ]

    makeSignUpValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
