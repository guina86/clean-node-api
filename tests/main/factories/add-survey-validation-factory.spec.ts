import { makeAddSurveyValidation } from '../../../src/main/factories'
import { Validation } from '../../../src//presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../src/validation/validators'

jest.mock('../../../src/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = [];
    ['question', 'answers'].forEach(field => validations.push(new RequiredFieldValidation(field)))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
