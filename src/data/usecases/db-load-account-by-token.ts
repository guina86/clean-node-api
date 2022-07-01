import { Decrypter, LoadAccountByTokenRepository } from '@data/protocols'
import { AccountModel } from '@domain/models'
import { LoadAccountByToken } from '@domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const id = await this.decrypter.decrypt(accessToken)
    if (!id) return null
    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    return account ?? null
  }
}
