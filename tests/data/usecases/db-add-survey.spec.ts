import { AddSurveyRepository } from '@data/protocols'
import { DbAddSurvey } from '@data/usecases'
import { mockSurveyParams } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('DbAddSurvey Usecase', () => {
  const makeSut = (): DbAddSurvey => new DbAddSurvey(addSurveyRepositorySpy)
  const addSurveyRepositorySpy = mock<AddSurveyRepository>()

  it('should call AddSurveyRepository with correct values', async () => {
    const sut = makeSut()
    const surveyData = mockSurveyParams()

    await sut.add(surveyData)

    expect(addSurveyRepositorySpy.add).toHaveBeenCalledWith(surveyData)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    addSurveyRepositorySpy.add.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.add(mockSurveyParams())

    await expect(promise).rejects.toThrow()
  })
})
