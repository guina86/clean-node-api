import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../protocols'
import { AccountModel } from '../../domain/models'
import { AddAccount, AddAccountModel } from '../../domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account !== null) return null
    const hashedPassword = await this.hasher.hash(accountData.password)
    const newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return newAccount
  }
}
