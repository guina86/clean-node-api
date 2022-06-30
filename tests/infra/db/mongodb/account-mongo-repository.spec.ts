import { AccountMongorepository, MongoHelper } from '@infra/db/mongodb'
import { mockAccountModel } from '@tests/domain/mocks'
import { Collection } from 'mongodb'

describe('AccountMongoRepository', () => {
  const makeSut = (): AccountMongorepository => new AccountMongorepository()
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    accountCollection = MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    it('should return true on add success', async () => {
      const sut = makeSut()

      const result = await sut.add(mockAccountModel())

      expect(result).toBeTruthy()
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountModel())

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('email@mail.com')

      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken()', () => {
    it('should update the account access token on updateAccessToken success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne(mockAccountModel())

      await sut.updateAccessToken(insertedId.toHexString(), 'any_token')

      const account = await accountCollection.findOne({ _id: insertedId })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    it('should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const accountMock = mockAccountModel()
      accountMock.accessToken = 'any_token'
      await accountCollection.insertOne(accountMock)

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    it('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      const accountMock = mockAccountModel()
      accountMock.accessToken = 'any_token'
      accountMock.role = 'admin'
      await accountCollection.insertOne(accountMock)

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    it('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      const accountMock = mockAccountModel()
      accountMock.accessToken = 'any_token'
      accountMock.role = 'admin'
      await accountCollection.insertOne(accountMock)

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })

    it('should return null on loadByToken with inany role', async () => {
      const sut = makeSut()
      const accountMock = mockAccountModel()
      await accountCollection.insertOne(accountMock)

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeFalsy()
    })

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('inany_token')

      expect(account).toBeNull()
    })
  })
})
