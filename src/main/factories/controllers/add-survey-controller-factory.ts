import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbAddSurvey } from '../usecases'
import { AddSurveyController } from '../../../presentation/controllers'
import { Controller } from '../../../presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
