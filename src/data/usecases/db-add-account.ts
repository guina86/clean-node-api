import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@data/protocols'
import { AddAccount, AddAccountParams } from '@domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<boolean> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account !== null) return false
    const hashedPassword = await this.hasher.hash(accountData.password)
    const result = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return result
  }
}
