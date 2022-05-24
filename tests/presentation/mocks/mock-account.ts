import { mockAccountModel } from '../../domain/mocks'
import { AccountModel } from '../../../src/domain/models'
import { AddAccount, AddAccountParams } from '../../../src/domain/usecases'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new AddAccountStub()
}
