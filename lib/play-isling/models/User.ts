import { Naming } from '@/lib/account/models/profile'

export interface SimpleUser extends Naming {
  id: string
  avatarUrl?: string
}
