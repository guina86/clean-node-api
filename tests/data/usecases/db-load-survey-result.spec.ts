import { DbLoadSurveyResult } from '@data/usecases'
import { mockSurveyResultModel } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'
import { LoadSurveyResultRepository } from '@data/protocols'

describe('DbLoadSurveyResult UseCase', () => {
  const makeSut = (): DbLoadSurveyResult => new DbLoadSurveyResult(loadSurveyResultRepositorySpy)
  const loadSurveyResultRepositorySpy = mock<LoadSurveyResultRepository>()

  beforeAll(() => {
    loadSurveyResultRepositorySpy.loadBySurveyId.mockResolvedValue(mockSurveyResultModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should call LoadSurveyResultRespository with correct values', async () => {
    const sut = makeSut()

    await sut.load('any_survey_id', 'any_account_id')

    expect(loadSurveyResultRepositorySpy.loadBySurveyId).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  it('should return a SurveyResult on success', async () => {
    const sut = makeSut()

    const surveyResult = await sut.load('any_survey_id', 'any_account_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    loadSurveyResultRepositorySpy.loadBySurveyId.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.load('any_survey_id', 'any_account_id')

    await expect(promise).rejects.toThrow()
  })
})
