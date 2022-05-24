import { mockLoadSurveyById, mockLoadSurveyResult } from '../mocks'
import { mockSurveyResultModel } from '../../domain/mocks'
import { LoadSurveyResultController } from '../../../src/presentation/controllers'
import { InvalidParamError, ServerError } from '../../../src/presentation/errors'
import { HttpRequest } from '../../../src/presentation/protocols'

const mockRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: {
    surveyId: 'any_survey_id'
  }
})

const loadSurveyByIdStub = mockLoadSurveyById()
const loadSurveyResultStub = mockLoadSurveyResult()

const makeSut = (): LoadSurveyResultController => new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)

describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct value', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenLastCalledWith('any_survey_id', 'any_account_id')
  })

  it('should return 500 if LoadSurveyResult throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockSurveyResultModel())
  })
})
