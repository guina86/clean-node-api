import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest } from '../protocols'
import { LoadSurveyById, SaveSurveyResult, SaveSurveyResultParams } from '../../domain/usecases'
import { SurveyModel, SurveyResultModel } from '../../domain/models'
import { InvalidParamError, ServerError } from '../errors'

class LoadSurveyByIdStub implements LoadSurveyById {
  async load (id: string): Promise<SurveyModel> {
    return makeFakeSurvey()
  }
}

class SaveSurveyResultStub implements SaveSurveyResult {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return makeFakeSurveyResult()
  }
}

const loadSurveyByIdStub = new LoadSurveyByIdStub()
const saveSurveyResultStub = new SaveSurveyResultStub()

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'question',
  answers: [
    { image: 'imagea.png', answer: 'answer A' },
    { image: 'imageb.png', answer: 'answer B' },
    { image: 'imagec.png', answer: 'answer C' }
  ],
  date: new Date('2022-1-1')
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'answer A',
  date: new Date('2022-1-1')
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'answer A'
  },
  accountId: 'any_account_id'
})

const makeSut = (): SaveSurveyResultController => new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

describe('SaveSurveyResultController', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toBeCalledWith('any_survey_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockResolvedValueOnce(null)
    const res = await sut.handle(makeFakeRequest())
    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual(new InvalidParamError('surveyId'))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockRejectedValueOnce(new Error())
    const res = await sut.handle(makeFakeRequest())
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(new ServerError())
  })

  it('should return 500 SaveSurveyResult throws', async () => {
    const sut = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const res = await sut.handle(makeFakeRequest())
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(new ServerError())
  })

  it('should return 403 invalid answer is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.answer = 'invalid_answer'
    const res = await sut.handle(httpRequest)
    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual(new InvalidParamError('answer'))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const sut = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'answer A',
      date: expect.any(Date)
    })
  })

  it('should return 200 on success', async () => {
    const sut = makeSut()
    const res = await sut.handle(makeFakeRequest())
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(makeFakeSurveyResult())
  })
})
