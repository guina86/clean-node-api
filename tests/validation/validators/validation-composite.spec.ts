import { ValidationComposite } from '@validation/validators'
import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { mock } from 'jest-mock-extended'

describe('Validation Composite', () => {
  const makeSut = (): ValidationComposite => new ValidationComposite(validationStubs)
  const validationStubs = [mock<Validation>(), mock<Validation>()]

  beforeEach(jest.resetAllMocks)

  it('should return an error if any validation fails', () => {
    validationStubs[0].validate.mockReturnValueOnce(new MissingParamError('field'))
    const sut = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if more than one validation fails', () => {
    validationStubs[0].validate.mockReturnValueOnce(new InvalidParamError('field_1'))
    validationStubs[1].validate.mockReturnValueOnce(new MissingParamError('field_2'))
    const sut = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new InvalidParamError('field_1'))
  })

  it('should return nothing if all validations succeed', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
