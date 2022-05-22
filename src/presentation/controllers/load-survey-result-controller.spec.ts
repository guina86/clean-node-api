import { LoadSurveyResultController } from './load-survey-result-controller'
import { InvalidParamError } from '../errors'
import { HttpRequest } from '../protocols'
import { mockLoadSurveyById } from '../test'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const loadSurveyByIdStub = mockLoadSurveyById()

const makeSut = (): LoadSurveyResultController => new LoadSurveyResultController(loadSurveyByIdStub)

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
})
