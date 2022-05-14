import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongorepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('should return an account on add success', async () => {
    const sut = new AccountMongorepository()
    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
    expect(account.password).toBe('valid_password')
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = new AccountMongorepository()
    await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
    const account = await sut.loadByEmail('valid_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
    expect(account.password).toBe('valid_password')
  })

  it('should return null if loadByEmail fails', async () => {
    const sut = new AccountMongorepository()
    const account = await sut.loadByEmail('valid_email@mail.com')
    expect(account).toBeNull()
  })
})
