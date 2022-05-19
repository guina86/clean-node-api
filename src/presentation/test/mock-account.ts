import { AccountModel } from '../../domain/models'
import { mockAccountModel } from '../../domain/test'
import { AddAccount, AddAccountParams } from '../../domain/usecases'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new AddAccountStub()
}
