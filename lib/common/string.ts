const escapeMap: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#39;': "'",
  '&quot;': '"',
}

export const unescape = (str: string) => {
  return str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    (tag) => escapeMap[tag] || tag
  )
}

export const truncateWithEllipsis = (str: string, len: number) => {
  if (str.length <= len) {
    return str
  }

  return str
    .slice(0, len)
    .trim()
    .replace(/[^\p{L}\d]+$/gmu, '')
    .concat('...')
}
