import { mockLoadSurveyResultRepository } from '../test'
import { DbLoadSurveyResult } from './db-load-survey-result'

const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()

const makeSut = (): DbLoadSurveyResult => new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

describe('DbLoadSurveyResult UseCase', () => {
  it('should call LoadSurveyResultRespository with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'load')
    await sut.load('any_survey_id')
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'load').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })
})
