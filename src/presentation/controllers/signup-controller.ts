import { EmailInUseError } from '@presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@presentation/helpers'
import { Controller, HttpResponse, Validation } from '@presentation/protocols'
import { AddAccount, Authentication } from '@domain/usecases'

export type SignUpControllerRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (request: SignUpControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      const { name, email, password } = request
      const addResult = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!addResult) return forbidden(new EmailInUseError())
      const authenticationResult = await this.authentication.auth({ email, password })
      return ok(authenticationResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
