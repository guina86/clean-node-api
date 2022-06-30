import { makeAddSurveyValidation } from '@main/factories'
import { RequiredFieldValidation, ValidationComposite } from '@validation/validators'

jest.mock('@validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const validations = [
      new RequiredFieldValidation('question'),
      new RequiredFieldValidation('answers')
    ]

    makeAddSurveyValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
