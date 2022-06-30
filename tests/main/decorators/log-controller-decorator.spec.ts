import { LogErrorRepository } from '@data/protocols'
import { LogControllerDecorator } from '@main/decorators'
import { Controller } from '@presentation/protocols'
import { mockRequest, mockResponse, mockServerError } from '@tests/main/mocks'
import { mock } from 'jest-mock-extended'

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
