import { LoadSurveysController, LoadSurveysControllerRequest } from '../../../src/presentation/controllers'
import { ServerError } from '../../../src/presentation/errors'
import { mockLoadSurveys } from '../mocks'
import { mockSurveyModelArray } from '../../domain/mocks'

const mockRequest = (): LoadSurveysControllerRequest => ({ accountId: 'any_id' })

const loadSurveysStub = mockLoadSurveys()

const makeSut = (): LoadSurveysController => new LoadSurveysController(loadSurveysStub)

describe('LoadSurveys Controller', () => {
  it('should call LoadSurveys with correct value', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockSurveyModelArray())
  })

  it('should return 204 if LoadSurveys returns empty', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })

  it('should return 500 if LoadSurvey throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
