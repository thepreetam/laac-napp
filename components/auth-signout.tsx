'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'

export function AuthSignout() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
