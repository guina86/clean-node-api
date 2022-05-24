import { mockAddSurvey, mockValidation } from '../mocks'
import { AddSurveyController, AddSurveyControllerRequest } from '../../../src/presentation/controllers'
import { ServerError } from '../../../src/presentation/errors'

const mockRequest = (): AddSurveyControllerRequest => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' }
  ]
})

const validationStub = mockValidation()
const addSurveyStub = mockAddSurvey()

const makeSut = (): AddSurveyController => new AddSurveyController(validationStub, addSurveyStub)

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('should return 400 if Validation fails', async () => {
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const sut = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error())
  })

  it('should call AddSurvey with correct values', async () => {
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const sut = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({ ...request, date: expect.any(Date) })
  })

  it('should return 500 if AddSurvey throws', async () => {
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const sut = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(new Error().stack))
  })

  it('should return 204 on success', async () => {
    const sut = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })
})
