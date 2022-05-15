import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('should return nothing if validation succeeds', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ any_field: 'any_field_name' })
    expect(error).toBeFalsy()
  })
})
