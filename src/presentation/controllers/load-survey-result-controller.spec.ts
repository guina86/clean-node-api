import { HttpRequest } from '../protocols'
import { mockLoadSurveyById } from '../test'
import { LoadSurveyResultController } from './load-survey-result-controller'

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
})
