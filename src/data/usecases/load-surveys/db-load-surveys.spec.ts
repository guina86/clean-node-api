import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { LoadSurveysRepository } from '../../../data/protocols/db/survey/load-surveys-repository'

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
})
