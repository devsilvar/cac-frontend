import { useAuthContext } from '../context/AuthContext'

export const useAdminAuth = () => {
  return useAuthContext()
}