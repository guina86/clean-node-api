import { SaveSurveyResultController } from '../../../presentation/controllers'
import { Controller } from '../../../presentation/protocols'
import { makeDbSaveSurveyResult } from '../usecases'
import { makeDbLoadSurveyById } from '../usecases/db-load-survey-by-id.factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return controller
}
