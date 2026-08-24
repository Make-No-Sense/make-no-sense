import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from './admin-session'

export async function requireAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!(await isValidAdminSessionToken(token))) {
    throw new Error('Unauthorized')
  }
}
