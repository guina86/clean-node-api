import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases'
import { Authentication } from '../../../domain/usecases'
import { AccountMongorepository } from '../../../infra/db/mongodb'
import { BcryptAdapter, JwtAdapter } from '../../../infra/cryptography'

export const makeDbAuthentication = (): Authentication => {
  const accountMongorepository = new AccountMongorepository()
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongorepository, bcryptAdapter, jwtAdapter, accountMongorepository)
}
