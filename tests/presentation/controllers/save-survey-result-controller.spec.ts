import { SaveSurveyResultController, SaveSurveyResultControllerRequest } from '@presentation/controllers'
import { InvalidParamError, ServerError } from '@presentation//errors'
import { mockSurveyModel, mockSurveyResultModel } from '@tests/domain/mocks'
import { LoadSurveyById, SaveSurveyResult } from '@domain/usecases'
import { mock } from 'jest-mock-extended'

const mockRequest = (): SaveSurveyResultControllerRequest => ({
  surveyId: 'any_survey_id',
  answer: 'answer A',
  accountId: 'any_account_id'
})

describe('SaveSurveyResultController', () => {
  const makeSut = (): SaveSurveyResultController => new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)
  const loadSurveyByIdSpy = mock<LoadSurveyById>()
  const saveSurveyResultSpy = mock<SaveSurveyResult>()

  beforeAll(() => {
    loadSurveyByIdSpy.load.mockResolvedValue(mockSurveyModel())
    saveSurveyResultSpy.save.mockResolvedValue(mockSurveyResultModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should call LoadSurveyById with correct values', async () => {
    const sut = makeSut()

    await sut.handle(mockRequest())

    expect(loadSurveyByIdSpy.load).toBeCalledWith('any_survey_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    loadSurveyByIdSpy.load.mockResolvedValueOnce(null)
    const sut = makeSut()

    const res = await sut.handle(mockRequest())

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual(new InvalidParamError('surveyId'))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    loadSurveyByIdSpy.load.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const res = await sut.handle(mockRequest())

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(new ServerError())
  })

  it('should return 500 SaveSurveyResult throws', async () => {
    saveSurveyResultSpy.save.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const res = await sut.handle(mockRequest())

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(new ServerError())
  })

  it('should return 403 invalid answer is provided', async () => {
    const sut = makeSut()
    const request = mockRequest()
    request.answer = 'invalid_answer'

    const res = await sut.handle(request)

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual(new InvalidParamError('answer'))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const sut = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(saveSurveyResultSpy.save).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'answer A',
      date: expect.any(Date)
    })
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()

    const res = await sut.handle(mockRequest())

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(mockSurveyResultModel())
  })
})
