import { SurveyResultModel } from '../../../src/domain/models'
import { mockSurveyResultModel } from '../../domain/mocks'
import { SaveSurveyResultParams } from '../../../src/domain/usecases'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '../../../src/data/protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultRepositoryStub()
}
