import { getDisplayName } from '@/lib/account/models/profile'
import { getAvatarString } from '@/lib/common/user'
import Profile from '@/lib/account/models/profile'
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar'

export interface UserAvatarProps {
  profile: Profile
}
export default function UserAvatar({ profile }: UserAvatarProps) {
  return (
    <Avatar className="w-40 h-40">
      <AvatarImage src={profile.avatarUrl} />
      <AvatarFallback>
        <div className="text-6xl">
          {getAvatarString(getDisplayName(profile))}
        </div>
      </AvatarFallback>
    </Avatar>
  )
}
