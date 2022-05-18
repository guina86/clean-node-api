import { ValidationComposite } from './validation-composite'
import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

class ValidationStub implements Validation {
  validate (inputh: any): Error {
    return null
  }
}

const validationStubs = [new ValidationStub(), new ValidationStub()]

describe('Validation Composite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return an error if any validation fails', () => {
    const sut = new ValidationComposite(validationStubs)
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if more than one validation fails', () => {
    const sut = new ValidationComposite(validationStubs)
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('field_1'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field_2'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field_1'))
  })

  it('should return nothing if all validations succeed', () => {
    const sut = new ValidationComposite(validationStubs)
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
