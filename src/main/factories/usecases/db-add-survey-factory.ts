import { DbAddSurvey } from '../../../data/usecases'
import { AddSurvey } from '../../../domain/usecases'
import { SurveyMongorepository } from '../../../infra/db/mongodb'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongorepository = new SurveyMongorepository()
  return new DbAddSurvey(surveyMongorepository)
}
