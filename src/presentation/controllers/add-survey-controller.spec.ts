import { AddSurveyController } from './add-survey-controller'
import { ServerError } from '../errors'
import { HttpRequest } from '../protocols'
import { mockAddSurvey, mockValidation } from '../test'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' }
    ]
  }
})

const validationStub = mockValidation()
const addSurveyStub = mockAddSurvey()

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
    expect(addSpy).toHaveBeenCalledWith({ ...httpRequest.body, date: expect.any(Date) })
  })

  it('should return 500 if AddSurvey throws', async () => {
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(new Error().stack))
  })

  it('should return 204 on success', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })
})
