import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '../../infra/db/mongodb'
import { mockSurveyModel, mockSurveyModelArray } from '../../domain/test'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Leandro',
    email: 'email@mail.com',
    password: '123',
    role
  })
  const id = res.insertedId.toHexString()
  const accessToken = sign({ id } , env.jwtSecret)
  await accountCollection.updateOne({
    _id: res.insertedId
  },{
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(mockSurveyModel())
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockSurveyModel())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    it('should return 200 on load survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany(mockSurveyModelArray(4))
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
