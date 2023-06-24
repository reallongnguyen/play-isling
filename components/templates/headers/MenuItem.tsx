import Link from 'next/link'

export interface MenuItemProps {
  name: string
  url: string
  active: boolean
}

export default function MenuItem({ name, url, active }: MenuItemProps) {
  return (
    <Link
      href={url}
      className={`text-lg font-semibold ${
        active ? 'text-secondary/90' : 'text-secondary/60'
      }`}
    >
      {name}
    </Link>
  )
}
