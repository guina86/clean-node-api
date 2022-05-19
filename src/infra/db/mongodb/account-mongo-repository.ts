import { MongoHelper } from './mongo-helper'
import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '../../../data/protocols'
import { AccountModel } from '../../../domain/models'
import { AddAccountParams } from '../../../domain/usecases'

export class AccountMongorepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const data = { ...accountData } // copy made to avoid side effects. insertOne mutates the original object
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(data)
    return MongoHelper.map(data)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: MongoHelper.to_id(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      },{
        role: 'admin'
      }]
    })
    return account && MongoHelper.map(account)
  }
}
