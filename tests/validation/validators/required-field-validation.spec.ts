import { RequiredFieldValidation } from '@validation/validators'
import { MissingParamError } from '@presentation/errors'

describe('RequiredField Validation', () => {
  const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation('any_field')

  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('should return nothing if validation succeeds', () => {
    const sut = makeSut()

    const error = sut.validate({ any_field: 'any_field_name' })

    expect(error).toBeFalsy()
  })
})
