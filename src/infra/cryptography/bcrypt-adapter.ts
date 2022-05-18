import { Hasher, HashComparer } from '../../data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  async hash (value: string): Promise<string> {
    return bcrypt.hash(value, 12)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }
}
