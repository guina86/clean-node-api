import { DbSaveSurveyResult } from '@data/usecases'
import { SaveSurveyResultRepository } from '@data/protocols'
import { mockSurveyResultModel, mockSurveyResultParams } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('DbSaveSurveyResult Usecase', () => {
  const makeSut = (): DbSaveSurveyResult => new DbSaveSurveyResult(saveSurveyResultRepositorySpy)
  const saveSurveyResultRepositorySpy = mock<SaveSurveyResultRepository>()

  beforeAll(() => {
    saveSurveyResultRepositorySpy.save.mockResolvedValue(mockSurveyResultModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const sut = makeSut()

    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)

    expect(saveSurveyResultRepositorySpy.save).toHaveBeenCalledWith(surveyResultData)
  })

  it('should return a SurveyResult on success', async () => {
    const sut = makeSut()

    const surveyResult = await sut.save(mockSurveyResultParams())

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    saveSurveyResultRepositorySpy.save.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.save(mockSurveyResultParams())

    await expect(promise).rejects.toThrow()
  })
})
