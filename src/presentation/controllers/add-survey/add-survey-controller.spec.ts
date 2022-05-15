import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

class AddSurveyStub implements AddSurvey {
  async add (data: AddSurveyModel): Promise<void> {
    return undefined
  }
}

const validationStub = new ValidationStub()
const addSurveyStub = new AddSurveyStub()

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' }
    ]
  }
})

const makeSut = (): AddSurveyController => new AddSurveyController(validationStub, addSurveyStub)

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

  it('should call AddSurvey with correct values', async () => {
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
