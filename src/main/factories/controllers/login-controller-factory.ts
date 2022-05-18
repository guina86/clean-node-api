import { makeLoginValidation } from './login-validation-factory'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbAuthentication } from '../usecases'
import { LoginController } from '../../../presentation/controllers'
import { Controller } from '../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
