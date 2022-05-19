import { ValidationComposite } from './validation-composite'
import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { mockValidation } from '../../presentation/test'

const validationStubs = [mockValidation(), mockValidation()]

const makeSut = (): ValidationComposite => new ValidationComposite(validationStubs)

describe('Validation Composite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return an error if any validation fails', () => {
    const sut = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if more than one validation fails', () => {
    const sut = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('field_1'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field_2'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field_1'))
  })

  it('should return nothing if all validations succeed', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
