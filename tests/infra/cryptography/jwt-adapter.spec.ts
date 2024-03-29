import { JwtAdapter } from '@infra/cryptography'
import { throwError } from '@tests/domain/mocks'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => 'any_token',
  verify: (): any => ({ id: 'any_id' })
}))

describe('Jwt Adapter', () => {
  const makeSut = (): JwtAdapter => new JwtAdapter('secret')

  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('any_id')

      expect(accessToken).toBe('any_token')
    })

    it('should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)

      const promise = sut.encrypt('any_id')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    it('should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('any_token')

      expect(value).toBe('any_id')
    })

    it('should return null if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError)

      const result = await sut.decrypt('any_token')

      expect(result).toBeNull()
    })

    it('should return null if verify returns null', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => null)

      const result = await sut.decrypt('any_token')

      expect(result).toBeNull()
    })
  })
})
