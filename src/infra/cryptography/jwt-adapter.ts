import { Encrypter, Decrypter } from '../../data/protocols'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }

  async decrypt (token: string): Promise<string> {
    jwt.verify(token, this.secret, (err, decoded) => {
      if (err) return null
    })
    return token
  }
}
