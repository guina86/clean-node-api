import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

import { LoadSurveysController } from '../../../presentation/controllers/load-surveys/load-surveys-controller'
import { makeDbLoadSurveys } from '../usecases/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}