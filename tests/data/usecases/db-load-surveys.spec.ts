import { DbLoadSurveys } from '@data/usecases'
import { LoadSurveysRepository } from '@data/protocols'
import { LoadSurveys } from '@domain/usecases'
import { mockSurveyModelArray } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('DbLoadSurveys', () => {
  const makeSut = (): LoadSurveys => new DbLoadSurveys(loadSurveysRepositoryStub)
  const loadSurveysRepositoryStub = mock<LoadSurveysRepository>()

  beforeAll(() => {
    loadSurveysRepositoryStub.loadAll.mockResolvedValue(mockSurveyModelArray())
  })

  beforeEach(jest.clearAllMocks)

  it('should call LoadSurveysRepository with correct value', async () => {
    const sut = makeSut()

    await sut.load('any_id')

    expect(loadSurveysRepositoryStub.loadAll).toHaveBeenCalledWith('any_id')
  })

  it('should return a list of surveys on success', async () => {
    const sut = makeSut()

    const surveys = await sut.load('any_id')

    expect(surveys).toEqual(mockSurveyModelArray())
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    loadSurveysRepositoryStub.loadAll.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  })
})
