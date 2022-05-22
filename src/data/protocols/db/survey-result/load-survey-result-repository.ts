import { SurveyResultModel } from '../../../../domain/models'

export interface LoadSurveyResultRepository {
  load: (surveyId: string) => Promise<SurveyResultModel>
}
