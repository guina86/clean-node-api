import { SurveyModel } from '@domain/models'

export interface LoadSurveyById {
  load: (id: string) => Promise<SurveyModel>
}
