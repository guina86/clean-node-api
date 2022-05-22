import { DbLoadSurveyResult } from '../../../data/usecases'
import { LoadSurveyResult } from '../../../domain/usecases'
import { SurveyResultMongoRepository } from '../../../infra/db/mongodb'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository)
}
