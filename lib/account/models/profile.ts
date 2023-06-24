export enum Gender {
  male,
  female,
  other,
  unknown,
}

export default interface Profile {
  accountId: number
  email: string
  firstName?: string
  lastName?: string
  gender?: Gender
  dateOfBirth?: Date
}

export function getDisplayName(profile: Profile) {
  if (profile.firstName && profile.lastName) {
    return `${profile.lastName} ${profile.firstName}`
  }

  if (profile.firstName) {
    return profile.firstName
  }

  return profile.email
}
