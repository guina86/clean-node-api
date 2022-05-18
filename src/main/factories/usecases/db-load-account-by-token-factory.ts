import env from '../../config/env'
import { DbLoadAccountByToken } from '../../../data/usecases'
import { LoadAccountByToken } from '../../../domain/usecases'
import { JwtAdapter } from '../../../infra/cryptography'
import { AccountMongorepository } from '../../../infra/db/mongodb'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongorepository = new AccountMongorepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongorepository)
}
