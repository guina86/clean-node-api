import { LoadSurveyResultController } from '../../../presentation/controllers'
import { Controller } from '../../../presentation/protocols'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '../usecases'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return controller
}
