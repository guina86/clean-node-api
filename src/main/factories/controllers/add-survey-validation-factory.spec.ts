import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '../../../presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../validation/validators'

jest.mock('../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = [];
    ['question', 'answers'].forEach(field => validations.push(new RequiredFieldValidation(field)))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
