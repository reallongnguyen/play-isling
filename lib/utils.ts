import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomBase56 = customAlphabet(
  '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'
)

export const toKMBString = (num: number, precision = 2) => {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ]

  const found = map.find((x) => Math.abs(num) >= x.threshold)
  if (found) {
    const formatted =
      Math.floor((num / found.threshold) * Math.pow(10, precision)) /
        Math.pow(10, precision) +
      found.suffix
    return formatted
  }

  return num
}
