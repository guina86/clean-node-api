import { DbLoadSurveys } from '../../../data/usecases'
import { LoadSurveys } from '../../../domain/usecases'
import { SurveyMongorepository } from '../../../infra/db/mongodb'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongorepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
