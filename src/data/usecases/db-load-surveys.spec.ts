import { DbLoadSurveys } from './db-load-surveys'
import { mockLoadSurveysRepository } from '../test'
import { mockSurveyModelArray } from '../../domain/test'
import { LoadSurveys } from '../../domain/usecases'

const loadSurveysRepositoryStub = mockLoadSurveysRepository()

const makeSut = (): LoadSurveys => new DbLoadSurveys(loadSurveysRepositoryStub)

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository', async () => {
    const sut = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  it('should return a list of surveys on success', async () => {
    const sut = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveyModelArray())
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
