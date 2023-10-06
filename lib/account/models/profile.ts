export enum Gender {
  male,
  female,
  other,
  unknown,
}

export interface Naming {
  firstName?: string
  lastName?: string
}

export default interface Profile extends Naming {
  accountId: number
  email: string
  gender?: Gender
  dateOfBirth?: Date
  avatarUrl?: string
}

export function getDisplayName(profile: Naming) {
  if (profile.firstName && profile.lastName) {
    return `${profile.lastName} ${profile.firstName}`
  }

  if (profile.firstName) {
    return profile.firstName
  }

  return ''
}
