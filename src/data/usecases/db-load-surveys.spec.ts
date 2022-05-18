import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from '../protocols'
import { SurveyModel } from '../../domain/models'
import { LoadSurveys } from '../../domain/usecases'

class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    return makeFakeSurveys()
  }
}

const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()

const makeFakeSurveys = (): SurveyModel[] => [...Array(3)].map((_, i) => ({
  id: `id_${i}`,
  question: `question ${i}`,
  answers: [
    { image: `image${i}a.png`, answer: `answer ${i} A` },
    { image: `image${i}b.png`, answer: `answer ${i} B` },
    { image: `image${i}c.png`, answer: `answer ${i} C` }
  ],
  date: new Date('2022-1-1')
}))

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
    expect(surveys).toEqual(makeFakeSurveys())
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
