import { LoadSurveysController, LoadSurveysControllerRequest } from '@presentation/controllers'
import { ServerError } from '@presentation/errors'
import { LoadSurveys } from '@domain/usecases'
import { mockSurveyModelArray } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

const mockRequest = (): LoadSurveysControllerRequest => ({ accountId: 'any_id' })

describe('LoadSurveys Controller', () => {
  const makeSut = (): LoadSurveysController => new LoadSurveysController(loadSurveysSpy)
  const loadSurveysSpy = mock<LoadSurveys>()

  beforeAll(() => {
    loadSurveysSpy.load.mockResolvedValue(mockSurveyModelArray())
  })

  beforeEach(jest.clearAllMocks)

  it('should call LoadSurveys with correct value', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())

    expect(loadSurveysSpy.load).toHaveBeenCalledWith('any_id')
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockSurveyModelArray())
  })

  it('should return 204 if LoadSurveys returns empty', async () => {
    loadSurveysSpy.load.mockResolvedValueOnce([])
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })

  it('should return 500 if LoadSurvey throws', async () => {
    loadSurveysSpy.load.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
