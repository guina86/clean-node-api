import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('BcryptAdapter', () => {
  it('Should call bcrypt with correct value', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
  })
})
