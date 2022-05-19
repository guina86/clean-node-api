import { LoadSurveysController } from './load-surveys-controller'
import { ServerError } from '../errors'
import { mockLoadSurveys } from '../test'
import { mockSurveyModelArray } from '../../domain/test'

const loadSurveysStub = mockLoadSurveys()

const makeSut = (): LoadSurveysController => new LoadSurveysController(loadSurveysStub)

describe('LoadSurveys Controller', () => {
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
    expect(httpResponse.body).toEqual(mockSurveyModelArray())
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
