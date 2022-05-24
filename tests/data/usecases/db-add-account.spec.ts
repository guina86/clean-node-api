import { DbAddAccount } from '../../../src/data/usecases'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '../mocks'
import { mockAccountModel, mockAccountParams } from '../../domain/mocks'

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

  it('should return true on success', async () => {
    const sut = makeSut()
    const result = await sut.add(mockAccountParams())
    expect(result).toBe(true)
  })

  it('should return false if LoadAccountByEmailRepository returns an account', async () => {
    const sut = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccountModel())
    const result = await sut.add(mockAccountParams())
    expect(result).toBe(false)
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const sut = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountParams())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
