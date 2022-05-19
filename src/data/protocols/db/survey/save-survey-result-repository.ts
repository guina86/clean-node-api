import { SurveyResultModel } from '../../../../domain/models'
import { SaveSurveyResultParams } from '../../../../domain/usecases'

export interface SaveSurveyResultRepository {
  save: (surveyResultData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
