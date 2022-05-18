import { makeSignUpValidation } from './signup-validation-factory'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbAuthentication, makeDbAddAccount } from '../usecases'
import { SignUpController } from '../../../presentation/controllers'
import { Controller } from '../../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
