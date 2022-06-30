import { Decrypter, LoadAccountByTokenRepository } from '@data/protocols'
import { DbLoadAccountByToken } from '@data/usecases'
import { mockAccountModel } from '@tests/domain/mocks'
import { mock } from 'jest-mock-extended'

describe('DbLoadAccountByToken Usecase', () => {
  const makeSut = (): DbLoadAccountByToken => new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  const decrypterSpy = mock<Decrypter>()
  const loadAccountByTokenRepositorySpy = mock<LoadAccountByTokenRepository>()

  beforeAll(() => {
    decrypterSpy.decrypt.mockResolvedValue('decrypted_value')
    loadAccountByTokenRepositorySpy.loadByToken.mockResolvedValue(mockAccountModel())
  })

  beforeEach(jest.clearAllMocks)

  it('should call Decrypter with correct values', async () => {
    const sut = makeSut()

    await sut.load('any_token', 'any_role')

    expect(decrypterSpy.decrypt).toHaveBeenLastCalledWith('any_token')
  })

  it('should return null if Decrypter retuns null', async () => {
    decrypterSpy.decrypt.mockResolvedValueOnce(null)
    const sut = makeSut()

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeNull()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const sut = makeSut()

    await sut.load('any_token', 'any_role')

    expect(loadAccountByTokenRepositorySpy.loadByToken).toHaveBeenLastCalledWith('decrypted_value', 'any_role')
  })

  it('should return null if LoadAccountByTokenRepository retuns null', async () => {
    loadAccountByTokenRepositorySpy.loadByToken.mockResolvedValueOnce(null)
    const sut = makeSut()

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeNull()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()

    const account = await sut.load('any_token', 'any_role')

    expect(account).toEqual(mockAccountModel())
  })

  it('should throw if Decrypter throws', async () => {
    decrypterSpy.decrypt.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })

  it('should throw if LoadAccountBytTokenRepository throws', async () => {
    loadAccountByTokenRepositorySpy.loadByToken.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })
})
