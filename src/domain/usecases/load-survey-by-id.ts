import { SurveyModel } from '../models'

export interface LoadSurveyById {
  load: (id: string) => Promise<SurveyModel>
}
