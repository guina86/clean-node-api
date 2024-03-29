import { BcryptAdapter } from '@infra/cryptography'
import { throwError } from '@tests/domain/mocks'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => 'hashed_value',
  compare: async (): Promise<boolean> => true
}))

describe('BcryptAdapter', () => {
  const makeSut = (): BcryptAdapter => new BcryptAdapter()

  describe('hash()', () => {
    it('should call hash with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', expect.any(Number))
    })

    it('should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const hash = await sut.hash('any_value')

      expect(hash).toBe('hashed_value')
    })

    it('should throw if bcrypt hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)

      const promise = sut.hash('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    it('should call compare with correct value', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hash')

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('should return true when compare succeeds', async () => {
      const sut = makeSut()

      const result = await sut.compare('any_value', 'any_hash')

      expect(result).toBe(true)
    })

    it('should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

      const result = await sut.compare('any_value', 'wrong_hash')

      expect(result).toBe(false)
    })

    it('should throw if bcrypt compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)

      const promise = sut.compare('any_value', 'any_hash')

      await expect(promise).rejects.toThrow()
    })
  })
})
