import { DbLoadSurveys } from '../../../../data/usecases/load-surveys/db-load-surveys'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { SurveyMongorepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongorepository()
  return new DbLoadSurveys(surveyMongoRepository)
}