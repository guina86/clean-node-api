import { DbLoadSurveyById } from '@data/usecases'
import { LoadSurveyByIdRepository } from '@data/protocols'
import { mockSurveyModel } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('DbLoadSurveyById Usecase', () => {
  const makeSut = (): DbLoadSurveyById => new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  const loadSurveyByIdRepositorySpy = mock<LoadSurveyByIdRepository>()

  beforeAll(() => {
    loadSurveyByIdRepositorySpy.loadById.mockResolvedValue(mockSurveyModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should call LoadSurveyByIdRepository with correct id', async () => {
    const sut = makeSut()

    await sut.load('any_id')

    expect(loadSurveyByIdRepositorySpy.loadById).toHaveBeenCalledWith('any_id')
  })

  it('should return survey on success', async () => {
    const sut = makeSut()

    const survey = await sut.load('id_1')

    expect(survey).toEqual(mockSurveyModel())
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    loadSurveyByIdRepositorySpy.loadById.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  })
})
