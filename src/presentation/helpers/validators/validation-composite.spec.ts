import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (inputh: any): Error {
    return null
  }
}

const validationStub = new ValidationStub()

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const sut = new ValidationComposite([validationStub])
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
