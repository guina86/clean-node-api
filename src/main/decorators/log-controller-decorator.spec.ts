import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return makeFakeResponse()
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async logError (stack: string): Promise<void> {

  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'hashed_password'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const controllerStub = new ControllerStub()
const logErrorRepositoryStub = new LogErrorRepositoryStub()

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeResponse())
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(makeFakeServerError())
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
