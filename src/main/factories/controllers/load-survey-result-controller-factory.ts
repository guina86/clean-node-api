import { LoadSurveyResultController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '@main/factories/usecases'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return controller
}
