import { Validation } from '@presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@validation/validators'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = [];
  ['question', 'answers'].forEach(field => validations.push(new RequiredFieldValidation(field)))
  return new ValidationComposite(validations)
}
