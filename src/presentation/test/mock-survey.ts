import { SurveyModel } from '../../domain/models'
import { mockSurveyModel, mockSurveyModelArray } from '../../domain/test'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '../../domain/usecases'

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
