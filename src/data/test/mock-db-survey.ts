import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '../protocols'
import { SurveyModel } from '../../domain/models'
import { mockSurveyModel, mockSurveyModelArray } from '../../domain/test'
import { AddSurveyParams } from '../../domain/usecases'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> { }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return mockSurveyModelArray()
    }
  }
  return new LoadSurveysRepositoryStub()
}
