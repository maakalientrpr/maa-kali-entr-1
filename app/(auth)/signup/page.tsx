import SignupPage from '@/components/auth/signup-form'
import { requireUnauth } from '@/lib/auth-utils'

const page = async () => {
    await requireUnauth()
  return (
    <div>
      <SignupPage />
    </div>
  )
}

export default page
