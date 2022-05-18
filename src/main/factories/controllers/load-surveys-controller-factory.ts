import { makeLogControllerDecorator } from '../decorators'
import { makeDbLoadSurveys } from '../usecases'
import { LoadSurveysController } from '../../../presentation/controllers'
import { Controller } from '../../../presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
