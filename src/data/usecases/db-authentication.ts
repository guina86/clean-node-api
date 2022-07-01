import { Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@data/protocols'
import { Authentication, AuthenticationParams, AuthenticationResult } from '@domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAcessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationResult> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (!account) return null
    const auth = await this.hashComparer.compare(authentication.password, account.password)
    if (!auth) return null
    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAcessTokenRepository.updateAccessToken(account.id, accessToken)
    return { accessToken, name: account.name }
  }
}
