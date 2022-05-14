import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => 'hashed_value',
  compare: async (): Promise<boolean> => true
}))

describe('BcryptAdapter', () => {
  it('should call hash with correct value', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
  })

  it('should return a valid hash on hash success', async () => {
    const sut = new BcryptAdapter()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hashed_value')
  })

  it('should throw if bcrypt hash throws', async () => {
    const sut = new BcryptAdapter()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => Promise.reject(new Error()))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  it('should call compare with correct value', async () => {
    const sut = new BcryptAdapter()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('should return true when compare succeeds', async () => {
    const sut = new BcryptAdapter()
    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toBe(true)
  })

  it('should return false when compare fails', async () => {
    const sut = new BcryptAdapter()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const result = await sut.compare('any_value', 'wrong_hash')
    expect(result).toBe(false)
  })

  it('should throw if bcrypt compare throws', async () => {
    const sut = new BcryptAdapter()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.reject(new Error()))
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
