import { Decrypter, LoadAccountByTokenRepository } from '../protocols'
import { AccountModel } from '../../domain/models'
import { LoadAccountByToken } from '../../domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (!token) return null
    return await this.loadAccountByTokenRepository.loadByToken(token, role)
  }
}
