import { AddAccount, AddAccountParams } from '../../../src/domain/usecases'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<boolean> {
      return true
    }
  }
  return new AddAccountStub()
}
