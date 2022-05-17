import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from '../../protocols'
import { AddSurveyModel } from '../../../domain/usecases/add-survey'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> { }
}

const addSurveyRepositoryStub = new AddSurveyRepositoryStub()

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' }
  ],
  date: new Date()
})

const makeSut = (): DbAddSurvey => new DbAddSurvey(addSurveyRepositoryStub)

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
