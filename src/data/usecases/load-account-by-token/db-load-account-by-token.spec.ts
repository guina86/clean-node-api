import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
    return 'decrypted_value'
  }
}

const decrypterStub = new DecrypterStub()

const makeSut = (role?: string): DbLoadAccountByToken => new DbLoadAccountByToken(decrypterStub)

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    const sut = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
  })

  it('should return null if Decrypter retuns null', async () => {
    const sut = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
