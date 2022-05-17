import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import { ServerError } from '../../errors'

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
    date: new Date('2022-1-1')
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

  it('should return 204 if LoadSurveys returns empty', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })

  it('should return 500 if LoadSurvey throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
