import { DbAddAccount } from '@data/usecases'
import { AddAccount } from '@domain/usecases'
import { BcryptAdapter } from '@infra/cryptography'
import { AccountMongorepository } from '@infra/db/mongodb'

export const makeDbAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter()
  const accountMongorepository = new AccountMongorepository()
  return new DbAddAccount(bcryptAdapter, accountMongorepository, accountMongorepository)
}
