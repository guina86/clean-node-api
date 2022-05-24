import { LogControllerDecorator } from '../../../src/main/decorators'
import { serverError } from '../../../src/presentation/helpers'
import { Controller, HttpResponse } from '../../../src/presentation/protocols'
import { mockLogErrorRepository } from '../../data/mocks'

class ControllerStub implements Controller {
  async handle (request: any): Promise<HttpResponse> {
    return mockResponse()
  }
}

const mockRequest = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const mockResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'hashed_password'
  }
})

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const controllerStub = new ControllerStub()
const logErrorRepositoryStub = mockLogErrorRepository()

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    const request = mockRequest()
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  it('should return the same result of the controller', async () => {
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(mockResponse())
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(mockServerError())
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const request = mockRequest()
    await sut.handle(request)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
