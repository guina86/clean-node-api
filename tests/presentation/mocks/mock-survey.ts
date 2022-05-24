import { mockSurveyModel, mockSurveyModelArray } from '../../domain/mocks'
import { SurveyModel } from '../../../src/domain/models'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '../../../src/domain/usecases'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return undefined
    }
  }
  return new AddSurveyStub()
}
export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return mockSurveyModelArray()
    }
  }
  return new LoadSurveysStub()
}
