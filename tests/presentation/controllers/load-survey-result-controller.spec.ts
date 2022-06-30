import { LoadSurveyResultController, LoadSurveyResultControllerRequest } from '@presentation/controllers'
import { LoadSurveyResult, LoadSurveyById } from '@domain/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import { mockSurveyModel, mockSurveyResultModel } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

const mockRequest = (): LoadSurveyResultControllerRequest => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
})

describe('LoadSurveyResult Controller', () => {
  const makeSut = (): LoadSurveyResultController => new LoadSurveyResultController(loadSurveyByIdSpy, loadSurveyResultSpy)
  const loadSurveyByIdSpy = mock<LoadSurveyById>()
  const loadSurveyResultSpy = mock<LoadSurveyResult>()

  beforeAll(() => {
    loadSurveyByIdSpy.load.mockResolvedValue(mockSurveyModel())
    loadSurveyResultSpy.load.mockResolvedValue(mockSurveyResultModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should call LoadSurveyById with correct value', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())
    expect(loadSurveyByIdSpy.load).toHaveBeenCalledWith('any_survey_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    loadSurveyByIdSpy.load.mockResolvedValueOnce(null)
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    loadSurveyByIdSpy.load.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())

    expect(loadSurveyResultSpy.load).toHaveBeenLastCalledWith('any_survey_id', 'any_account_id')
  })

  it('should return 500 if LoadSurveyResult throws', async () => {
    loadSurveyResultSpy.load.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockSurveyResultModel())
  })
})
