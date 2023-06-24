import { HTMLProps, ReactNode } from 'react'

export interface PageHeaderProps extends HTMLProps<HTMLDivElement> {
  pageName?: string
  rightChildren?: ReactNode
}

export default function PageHeader({
  pageName,
  rightChildren,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={`flex items-start ${className}`} {...props}>
      <div className="flex-1">
        <div className="text-xl font-semibold">{pageName}</div>
      </div>
      <div>{rightChildren}</div>
    </div>
  )
}
