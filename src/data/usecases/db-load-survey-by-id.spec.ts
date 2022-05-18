import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from '../protocols'
import { SurveyModel } from '../../domain/models'

class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    return makeFakeSurvey()
  }
}

const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()

const makeFakeSurvey = (): SurveyModel => ({
  id: 'id_1',
  question: 'question 1',
  answers: [
    { image: 'imagea.png', answer: 'answer A' },
    { image: 'imageb.png', answer: 'answer B' },
    { image: 'imagec.png', answer: 'answer C' }
  ],
  date: new Date('2022-1-1')
})

const makeSut = (): DbLoadSurveyById => new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

describe('DbLoadSurveyById', () => {
  it('should call LoadSurveyByIdRepository with correct id', async () => {
    const sut = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return survey on success', async () => {
    const sut = makeSut()
    const survey = await sut.load('id_1')
    expect(survey).toEqual(makeFakeSurvey())
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
