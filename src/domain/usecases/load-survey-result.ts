import { SurveyResultModel } from '../models'

export interface LoadSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
