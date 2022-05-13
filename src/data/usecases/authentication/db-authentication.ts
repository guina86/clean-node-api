import { Authentication, AuthenticationModel, HashComparer, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAcessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null
    const auth = await this.hashComparer.compare(authentication.password, account.password)
    if (!auth) return null
    const token = await this.tokenGenerator.generate(account.id)
    await this.updateAcessTokenRepository.update(account.id, token)
    return token
  }
}
