import http from '@/lib/http'
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from '@/schemas/account.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),
  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),
  updatePersonalAccount: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),
  changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>('/accounts/change-password', body),
}

export default accountApiRequest
