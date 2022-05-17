import { DbLoadAccountByToken } from '../../../data/usecases/db-load-account-by-token'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { AccountMongorepository } from '../../../infra/db/mongodb/account-mongo-repository'
import env from '../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongorepository = new AccountMongorepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongorepository)
}
