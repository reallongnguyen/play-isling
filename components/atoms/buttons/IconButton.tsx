import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, FC } from 'react'

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default'
}

const IconButton: FC<IconButtonProps> = ({
  children,
  disabled,
  className,
  variant,
  ...props
}) => (
  <button
    className={cn(
      `
        flex justify-center items-center rounded-full h-10 w-10 font-semibold bg-opacity-20
        ${
          disabled
            ? 'cursor-not-allowed text-secondary/40'
            : 'text-secondary hover:bg-primary/40 active:bg-primary/70'
        }
        ${variant === 'outline' ? 'border border-primary-light' : ''}
      `,
      className
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
)

export default IconButton
