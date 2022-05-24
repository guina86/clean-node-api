import { makeSignUpValidation } from '../../../src/main/factories'
import { Validation } from '../../../src/presentation/protocols'
import { EmailValidator } from '../../../src/validation/protocols'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../src/validation/validators'

jest.mock('../../../src/validation/validators/validation-composite')

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const emailValidatorStub = new EmailValidatorStub()

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = [];
    ['name', 'email', 'password', 'passwordConfirmation'].forEach(field => validations.push(new RequiredFieldValidation(field)))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', emailValidatorStub))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
