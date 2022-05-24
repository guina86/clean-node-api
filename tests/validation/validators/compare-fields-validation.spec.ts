import { CompareFieldsValidation } from '../../../src/validation/validators'
import { InvalidParamError } from '../../../src/presentation/errors'

describe('RequiredField Validation', () => {
  it('should return a InvalidParamError if fields are not equal', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  it('should return nothing if validation succeeds', () => {
    const sut = new CompareFieldsValidation('field', 'field_to_compare')
    const error = sut.validate({ field: 'any_value', field_to_compare: 'any_value' })
    expect(error).toBeFalsy()
  })
})
