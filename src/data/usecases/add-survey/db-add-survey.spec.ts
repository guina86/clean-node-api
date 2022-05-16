import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {

  }
}

const addSurveyRepositoryStub = new AddSurveyRepositoryStub()

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' }
  ]
})

const makeSut = (): DbAddSurvey => new DbAddSurvey(addSurveyRepositoryStub)

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const sut = makeSut()
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
