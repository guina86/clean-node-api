import { AccountModel, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

class HasherStub implements Hasher {
  async hash (value: string): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    return (makeFakeAccount())
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const addAccountRepositoryStub = new AddAccountRepositoryStub()
const hasherStub = new HasherStub()
const makeSut = (): DbAddAccount => new DbAddAccount(hasherStub, addAccountRepositoryStub)

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throw if Hasher throws', async () => {
    const sut = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct account data', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
