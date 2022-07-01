import { makeSignUpValidation } from '@main/factories'
import { makeLogControllerDecorator } from '@main/factories/decorators'
import { makeDbAuthentication, makeDbAddAccount } from '@main/factories/usecases'
import { SignUpController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
