import { EmailValidatorAdapter } from '@infra/validators'
import { makeLoginValidation } from '@main/factories'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@validation/validators'

jest.mock('@validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const validations = [
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', new EmailValidatorAdapter())
    ]

    makeLoginValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
