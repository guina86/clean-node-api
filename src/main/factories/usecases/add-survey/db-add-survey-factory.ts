import { DbAddSurvey } from '../../../../data/usecases/db-add-survey'
import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { SurveyMongorepository } from '../../../../infra/db/mongodb/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongorepository = new SurveyMongorepository()
  return new DbAddSurvey(surveyMongorepository)
}
