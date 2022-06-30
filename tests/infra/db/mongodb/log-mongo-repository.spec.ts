import { LogMongoRepository, MongoHelper } from '@infra/db/mongodb'
import { Collection } from 'mongodb'

describe('LogMongoRepository', () => {
  const makeSut = (): LogMongoRepository => new LogMongoRepository()
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    errorCollection = MongoHelper.getCollection('errors')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await errorCollection.deleteMany({})
  })

  it('should create an error log on success', async () => {
    const sut = makeSut()

    await sut.logError('any_error')

    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
