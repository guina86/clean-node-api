import env from '../../../src/main/config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

export const mockAccessToken = async (surveyCollection: Collection, accountCollection: Collection, role?: string): Promise<string> => {
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
