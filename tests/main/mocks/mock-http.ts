import { serverError } from '@presentation/helpers'
import { HttpResponse } from '@presentation/protocols'

export const mockRequest = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

export const mockResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'hashed_password'
  }
})

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
