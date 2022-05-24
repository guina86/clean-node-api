import { makeLoginValidation } from '../../../src/main/factories'
import { Validation } from '../../../src/presentation/protocols'
import { EmailValidator } from '../../../src/validation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../src/validation/validators'

jest.mock('../../../src/validation/validators/validation-composite')

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const emailValidatorStub = new EmailValidatorStub()

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = [];
    ['email', 'password'].forEach(field => validations.push(new RequiredFieldValidation(field)))
    validations.push(new EmailValidation('email', emailValidatorStub))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
