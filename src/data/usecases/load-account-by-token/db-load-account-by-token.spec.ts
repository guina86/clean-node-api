import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
    return 'decrypted_value'
  }
}

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    return makeFakeAccount()
  }
}

const decrypterStub = new DecrypterStub()
const loadAccountByRepositoryStub = new LoadAccountByTokenRepositoryStub()

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeSut = (role?: string): DbLoadAccountByToken => new DbLoadAccountByToken(decrypterStub, loadAccountByRepositoryStub)

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
    const loadByTokenSpy = jest.spyOn(loadAccountByRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenLastCalledWith('decrypted_value', 'any_role')
  })

  it('should return null if LoadAccountByTokenRepository retuns null', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })

  it('should throw if Decrypter throws', async () => {
    const sut = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  it('should throw if LoadAccountBytTokenRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
