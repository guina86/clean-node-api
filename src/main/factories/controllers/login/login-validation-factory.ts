import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];
  ['email', 'password'].forEach(field => validations.push(new RequiredFieldValidation(field)))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
