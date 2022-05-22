import { SurveyResultModel } from '../models'

export interface SaveSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
