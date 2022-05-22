import { LoadSurveyResultController } from './load-survey-result-controller'
import { InvalidParamError, ServerError } from '../errors'
import { HttpRequest } from '../protocols'
import { mockLoadSurveyById, mockLoadSurveyResult } from '../test'
import { mockSurveyResultModel } from '../../domain/test'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const loadSurveyByIdStub = mockLoadSurveyById()
const loadSurveyResultStub = mockLoadSurveyResult()

const makeSut = (): LoadSurveyResultController => new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)

describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct value', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call LoadSurveyResult with correct value', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenLastCalledWith('any_id')
  })

  it('should return 500 if LoadSurveyResult throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockSurveyResultModel())
  })
})
