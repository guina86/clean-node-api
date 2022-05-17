import { RequiredFieldValidation, ValidationComposite } from '../../../validation/validators'
import { Validation } from '../../../presentation/protocols'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = [];
  ['question', 'answers'].forEach(field => validations.push(new RequiredFieldValidation(field)))
  return new ValidationComposite(validations)
}
