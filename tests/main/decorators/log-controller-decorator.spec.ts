import { LogErrorRepository } from '@data/protocols'
import { LogControllerDecorator } from '@main/decorators'
import { serverError } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'
import { mock } from 'jest-mock-extended'

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

describe('LogControllerDecorator', () => {
  const makeSut = (): LogControllerDecorator => new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  const controllerSpy = mock<Controller>()
  const logErrorRepositorySpy = mock<LogErrorRepository>()

  beforeAll(() => {
    controllerSpy.handle.mockResolvedValue(mockResponse())
  })

  it('should call controller handle', async () => {
    const sut = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(controllerSpy.handle).toHaveBeenCalledWith(request)
  })

  it('should return the same result of the controller', async () => {
    const sut = makeSut()
    const request = mockRequest()

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(mockResponse())
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    controllerSpy.handle.mockResolvedValueOnce(mockServerError())
    const sut = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(logErrorRepositorySpy.logError).toHaveBeenCalledWith('any_stack')
  })
})
