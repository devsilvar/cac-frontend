import { useAuthContext, AuthContextValue } from '../context/AuthContext'
import { useApi } from './useApi'
import { UseApi } from './useApi'

type UseAdminAuthReturn = AuthContextValue & {
  adminApi: UseApi
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const authContext = useAuthContext()
  const adminApi = useApi()
  
  return {
    ...authContext,
    adminApi
  }
}
