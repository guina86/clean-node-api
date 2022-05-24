import { DbLoadSurveys } from '../../../src/data/usecases'
import { mockLoadSurveysRepository } from '../mocks'
import { mockSurveyModelArray } from '../../domain/mocks'
import { LoadSurveys } from '../../../src/domain/usecases'

const loadSurveysRepositoryStub = mockLoadSurveysRepository()

const makeSut = (): LoadSurveys => new DbLoadSurveys(loadSurveysRepositoryStub)

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository with correct value', async () => {
    const sut = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load('any_id')
    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return a list of surveys on success', async () => {
    const sut = makeSut()
    const surveys = await sut.load('any_id')
    expect(surveys).toEqual(mockSurveyModelArray())
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
