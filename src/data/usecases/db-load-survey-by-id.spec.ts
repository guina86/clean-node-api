import { DbLoadSurveyById } from './db-load-survey-by-id'
import { mockLoadSurveyByIdRepository } from '../test'
import { mockSurveyModel } from '../../domain/test'

const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()

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
    expect(survey).toEqual(mockSurveyModel())
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
