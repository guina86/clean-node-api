import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResultRepository } from '../test'
import { mockSurveyResultModel, mockSurveyResultParams } from '../../domain/test'

const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()

const makeSut = (): DbSaveSurveyResult => new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

describe('DbSaveSurveyResult Usecase', () => {
  it('should call SaveSurveyResultRepository with correct values', async () => {
    const sut = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  it('should return a SurveyResult on success', async () => {
    const sut = makeSut()
    const surveyResult = await sut.save(mockSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
