import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'

describe('LoadSurveys Controller', () => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  const loadSurveysStub = new LoadSurveysStub()

  const makeFakeSurveys = (): SurveyModel[] => [...Array(3)].map((_, i) => ({
    id: `id_${i}`,
    question: `question ${i}`,
    answers: [
      { image: `image${i}a.png`, answer: `answer ${i} A` },
      { image: `image${i}b.png`, answer: `answer ${i} B` },
      { image: `image${i}c.png`, answer: `answer ${i} C` }
    ],
    date: new Date()
  }))

  const makeSut = (): LoadSurveysController => new LoadSurveysController(loadSurveysStub)

  it('should call LoadSurveys', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeSurveys())
  })
})
