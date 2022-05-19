import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from '../protocols'
import { SurveyResultModel } from '../../domain/models'
import { SaveSurveyResultParams } from '../../domain/usecases'

class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return makeFakeSurveyResult()
  }
}

const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub()

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date('2022-1-1')
})

const makeFakeSurveyResult = (): SurveyResultModel => ({ id: 'any_id', ...makeFakeSurveyResultData() })

const makeSut = (): DbSaveSurveyResult => new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

describe('DbSaveSurveyResult Usecase', () => {
  it('should call SaveSurveyResultRepository with correct values', async () => {
    const sut = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  it('should return a SurveyResult on success', async () => {
    const sut = makeSut()
    const surveyResult = await sut.save(makeFakeSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
})
