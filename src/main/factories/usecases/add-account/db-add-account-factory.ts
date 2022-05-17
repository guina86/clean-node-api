import { DbAddAccount } from '../../../../data/usecases/db-add-account'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter'
import { AccountMongorepository } from '../../../../infra/db/mongodb/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter()
  const accountMongorepository = new AccountMongorepository()
  return new DbAddAccount(bcryptAdapter, accountMongorepository, accountMongorepository)
}
