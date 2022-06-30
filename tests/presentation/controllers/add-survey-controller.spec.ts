import { AddSurvey } from '@domain/usecases'
import { AddSurveyController, AddSurveyControllerRequest } from '@presentation/controllers'
import { ServerError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { mock } from 'jest-mock-extended'

const mockRequest = (): AddSurveyControllerRequest => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' }
  ]
})

describe('AddSurvey Controller', () => {
  const makeSut = (): AddSurveyController => new AddSurveyController(validationSpy, addSurveySpy)
  const validationSpy = mock<Validation>()
  const addSurveySpy = mock<AddSurvey>()

  beforeEach(jest.clearAllMocks)

  it('should call Validation with correct values', async () => {
    const sut = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(validationSpy.validate).toHaveBeenCalledWith(request)
  })

  it('should return 400 if Validation fails', async () => {
    validationSpy.validate.mockReturnValueOnce(new Error())
    const sut = makeSut()
    const request = mockRequest()

    const httpResponse = await sut.handle(request)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error())
  })

  it('should call AddSurvey with correct values', async () => {
    const sut = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(addSurveySpy.add).toHaveBeenCalledWith({ ...request, date: expect.any(Date) })
  })

  it('should return 500 if AddSurvey throws', async () => {
    addSurveySpy.add.mockRejectedValueOnce(new Error())
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
