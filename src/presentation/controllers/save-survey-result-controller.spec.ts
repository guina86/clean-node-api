import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest } from '../protocols'
import { LoadSurveyById } from '../../domain/usecases'
import { SurveyModel } from '../../domain/models'

class LoadSurveyByIdStub implements LoadSurveyById {
  async load (id: string): Promise<SurveyModel> {
    return makeFakeSurvey()
  }
}

const loadSurveyByIdStub = new LoadSurveyByIdStub()

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

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const makeSut = (): SaveSurveyResultController => new SaveSurveyResultController(loadSurveyByIdStub)

describe('SaveSurveyResultController', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toBeCalledWith('any_id')
  })
})
