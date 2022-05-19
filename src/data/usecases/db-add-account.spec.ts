import { DbAddAccount } from './db-add-account'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '../test'
import { mockAccountModel, mockAccountParams } from '../../domain/test'

const addAccountRepositoryStub = mockAddAccountRepository()
const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository(null)
const hasherStub = mockHasher()
const makeSut = (): DbAddAccount => new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAccountParams())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  it('should throw if Hasher throws', async () => {
    const sut = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct account data', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add(mockAccountParams())
    expect(account).toEqual(mockAccountModel())
  })

  it('should return null if LoadAccountByEmailRepository not return null', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccountModel())
    const account = await sut.add(mockAccountParams())
    expect(account).toBeNull()
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const sut = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountParams())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
