import { SaveSurveyResultController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'
import { makeDbSaveSurveyResult, makeDbLoadSurveyById } from '@main/factories/usecases'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return controller
}
