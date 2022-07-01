import { Encrypter, Decrypter } from '@data/protocols'
import jwt from 'jsonwebtoken'

type Result = {
  id: string
}

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }

  async decrypt (token: string): Promise<string> {
    let result: Result
    try {
      result = jwt.verify(token, this.secret) as Result
    } catch (error) {
      return null
    }
    return result?.id ? result.id : null
  }
}
