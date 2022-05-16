import { DbLoadAccountByToken } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongorepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongorepository = new AccountMongorepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongorepository)
}
