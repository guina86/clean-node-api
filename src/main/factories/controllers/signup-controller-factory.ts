import { SignUpController } from '../../../presentation/controllers/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../usecases/db-add-account-factory'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
