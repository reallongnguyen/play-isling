export const getAvatarString = (userFullName: string | undefined) => {
  if (!userFullName) {
    return '-'
  }

  const idx = userFullName.lastIndexOf(' ') || 0

  return userFullName.charAt(idx + 1).toUpperCase()
}
