import { DbAddSurvey } from './db-add-survey'
import { mockAddSurveyRepository } from '../test'
import { mockSurveyParams } from '../../domain/test'

const addSurveyRepositoryStub = mockAddSurveyRepository()

const makeSut = (): DbAddSurvey => new DbAddSurvey(addSurveyRepositoryStub)

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = mockSurveyParams()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
