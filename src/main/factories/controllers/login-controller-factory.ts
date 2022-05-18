import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../presentation/controllers/login-controller'
import { Controller } from '../../../presentation/protocols'
import { makeDbAuthentication } from '../usecases/db-authentication-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
