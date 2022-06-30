import { DbAuthentication } from '@data/usecases'
import { Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@data/protocols'
import { mockAccountModel, mockAuthenticationParams } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('DbAuthentication UseCase', () => {
  const makeSut = (): DbAuthentication => new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  const hashComparerSpy = mock<HashComparer>()
  const encrypterSpy = mock<Encrypter>()
  const loadAccountByEmailRepositorySpy = mock<LoadAccountByEmailRepository>()
  const updateAccessTokenRepositorySpy = mock<UpdateAccessTokenRepository>()

  beforeAll(() => {
    hashComparerSpy.compare.mockResolvedValue(true)
    encrypterSpy.encrypt.mockResolvedValue('any_token')
    loadAccountByEmailRepositorySpy.loadByEmail.mockResolvedValue(mockAccountModel())
    updateAccessTokenRepositorySpy.updateAccessToken.mockResolvedValue(null)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const sut = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(loadAccountByEmailRepositorySpy.loadByEmail).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    loadAccountByEmailRepositorySpy.loadByEmail.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    loadAccountByEmailRepositorySpy.loadByEmail.mockResolvedValueOnce(null)
    const sut = makeSut()

    const model = await sut.auth(mockAuthenticationParams())

    expect(model).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const sut = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(hashComparerSpy.compare).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('should throw if HashComparer throws', async () => {
    hashComparerSpy.compare.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    hashComparerSpy.compare.mockResolvedValueOnce(false)
    const sut = makeSut()

    const model = await sut.auth(mockAuthenticationParams())

    expect(model).toBeNull()
  })

  it('should call Encrypter with correct id', async () => {
    const sut = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(encrypterSpy.encrypt).toHaveBeenCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    encrypterSpy.encrypt.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const sut = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(updateAccessTokenRepositorySpy.updateAccessToken).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    updateAccessTokenRepositorySpy.updateAccessToken.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('should return an authenticationResult  on success', async () => {
    const sut = makeSut()

    const { accessToken, name } = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBe('any_token')
    expect(name).toBe('any_name')
  })
})
