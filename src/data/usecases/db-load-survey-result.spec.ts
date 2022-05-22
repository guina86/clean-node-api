import { mockSurveyResultModel } from '../../domain/test'
import { mockLoadSurveyResultRepository } from '../test'
import { DbLoadSurveyResult } from './db-load-survey-result'

const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()

const makeSut = (): DbLoadSurveyResult => new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

describe('DbLoadSurveyResult UseCase', () => {
  it('should call LoadSurveyResultRespository with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should return a SurveyResult on success', async () => {
    const sut = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    await expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })
})
