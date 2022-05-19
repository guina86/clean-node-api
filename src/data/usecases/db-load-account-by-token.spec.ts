import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '../test'
import { mockAccountModel } from '../../domain/test'

const decrypterStub = mockDecrypter()
const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()

const makeSut = (role?: string): DbLoadAccountByToken => new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    const sut = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
  })

  it('should return null if Decrypter retuns null', async () => {
    const sut = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const sut = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenLastCalledWith('decrypted_value', 'any_role')
  })

  it('should return null if LoadAccountByTokenRepository retuns null', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  it('should throw if Decrypter throws', async () => {
    const sut = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  it('should throw if LoadAccountBytTokenRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
