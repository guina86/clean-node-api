import { DbAddAccount } from '@data/usecases'
import { mockAccountModel, mockAccountParams } from '@tests/domain/mocks'
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@data/protocols'
import { mock } from 'jest-mock-extended'

describe('DbAddAccount Usecase', () => {
  const makeSut = (): DbAddAccount => new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  const addAccountRepositorySpy = mock<AddAccountRepository>()
  const loadAccountByEmailRepositorySpy = mock<LoadAccountByEmailRepository>()
  const hasherSpy = mock<Hasher>()

  beforeAll(() => {
    addAccountRepositorySpy.add.mockResolvedValue(true)
    loadAccountByEmailRepositorySpy.loadByEmail.mockResolvedValue(null)
    hasherSpy.hash.mockResolvedValue('hashed_password')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call Hasher with correct password', async () => {
    const sut = makeSut()

    await sut.add(mockAccountParams())

    expect(hasherSpy.hash).toHaveBeenCalledWith('any_password')
  })

  it('should throw if Hasher throws', async () => {
    hasherSpy.hash.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.add(mockAccountParams())

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct account data', async () => {
    const sut = makeSut()

    await sut.add(mockAccountParams())

    expect(addAccountRepositorySpy.add).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    addAccountRepositorySpy.add.mockRejectedValueOnce(new Error())
    const sut = makeSut()

    const promise = sut.add(mockAccountParams())

    await expect(promise).rejects.toThrow()
  })

  it('should return true on success', async () => {
    const sut = makeSut()

    const result = await sut.add(mockAccountParams())

    expect(result).toBe(true)
  })

  it('should return false if LoadAccountByEmailRepository returns an account', async () => {
    loadAccountByEmailRepositorySpy.loadByEmail.mockResolvedValueOnce(mockAccountModel())
    const sut = makeSut()

    const result = await sut.add(mockAccountParams())

    expect(result).toBe(false)
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const sut = makeSut()

    await sut.add(mockAccountParams())

    expect(loadAccountByEmailRepositorySpy.loadByEmail).toHaveBeenCalledWith('any_email@mail.com')
  })
})
