import { Encrypter } from '../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/criptography/decrypter'

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
