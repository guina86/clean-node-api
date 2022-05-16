import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  loadByToken: (acessToken: string, role?: string) => Promise<AccountModel>
}
