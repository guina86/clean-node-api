import { DbLoadSurveyById } from '@data/usecases'
import { SurveyMongorepository } from '@infra/db/mongodb'

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongorepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
