
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  return new ValidationComposite(fields.map(fieldName => new RequiredFieldValidation(fieldName)))
}
