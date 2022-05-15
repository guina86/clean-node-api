import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation } from './add-survey-controller-protocols'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

const validationStub = new ValidationStub()

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' }
    ]
  }
})

const makeSut = (): AddSurveyController => new AddSurveyController(validationStub)

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error())
  })
})
