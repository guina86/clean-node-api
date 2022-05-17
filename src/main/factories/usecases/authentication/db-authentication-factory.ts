import env from '../../../config/env'
import { DbAuthentication } from '../../../../data/usecases/db-authentication'
import { AccountMongorepository } from '../../../../infra/db/mongodb/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter'
import { Authentication } from '../../../../domain/usecases/authentication'

export const makeDbAuthentication = (): Authentication => {
  const accountMongorepository = new AccountMongorepository()
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongorepository, bcryptAdapter, jwtAdapter, accountMongorepository)
}
