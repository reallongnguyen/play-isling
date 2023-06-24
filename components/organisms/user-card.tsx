import Profile, { getDisplayName } from '@/lib/account/models/profile'
import UserAvatar from './user-avatar'

export interface UserCardProps {
  profile: Profile
}

export default function UserCard({ profile }: UserCardProps) {
  return (
    <div className="lg:flex items-center">
      <UserAvatar profile={profile} />
      <div className="lg:ml-6">
        <div className="text-3xl">{getDisplayName(profile)}</div>
        <div className="brightness-90 mt-1 font-light">{profile.email}</div>
      </div>
    </div>
  )
}
