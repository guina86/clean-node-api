import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongorepository } from './account-mongo-repository'

let accountCollection: Collection

const makeFakeAccount = (): any => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  accessToken: 'valid_token'
})

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

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = new AccountMongorepository()
      const account = await sut.add(makeFakeAccount())

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('valid_name')
      expect(account.email).toBe('valid_email@mail.com')
      expect(account.password).toBe('valid_password')
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = new AccountMongorepository()
      await accountCollection.insertOne(makeFakeAccount())
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

  describe('updateAccessToken()', () => {
    it('should update the account access token on updateAccessToken success', async () => {
      const sut = new AccountMongorepository()
      const { insertedId } = await accountCollection.insertOne(makeFakeAccount())
      await sut.updateAccessToken(insertedId.toHexString(), 'valid_token')
      const account = await accountCollection.findOne({ _id: insertedId })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('valid_token')
    })
  })

  describe('loadByToken()', () => {
    it('should return an account on loadByToken without role', async () => {
      const sut = new AccountMongorepository()
      await accountCollection.insertOne(makeFakeAccount())
      const account = await sut.loadByToken('valid_token')
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
})
