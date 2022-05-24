import { AccountModel } from '../../../src/domain/models'
import { mockAccountModel } from '../../domain/mocks'
import { AddAccountParams } from '../../../src/domain/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '../../../src/data/protocols'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<boolean> {
      return true
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (returnValue: AccountModel = mockAccountModel()): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return returnValue
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return null
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
