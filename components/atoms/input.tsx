import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from './label'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  hint?: React.ReactNode
  isError?: boolean
  wrapperClassName?: string
  hintClassName?: string
  labelClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      name,
      isError,
      required,
      wrapperClassName,
      hintClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-1', wrapperClassName)}>
        {label && (
          <Label htmlFor={name} className={labelClassName}>
            {label}
            {!required && (
              <span className="font-light ml-1 brightness-75">(optional)</span>
            )}
          </Label>
        )}
        <input
          name={name}
          className={cn(
            `
              flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
              ${isError ? 'border-[#ff4d4f]' : 'border-input'}
            `,
            className
          )}
          ref={ref}
          {...props}
        />
        <p
          className={cn(
            `
              text-sm min-h-[1.25rem] pb-1 flex items-start ml-1 leading-none font-light
              ${isError ? 'text-[#ff4d4f]' : 'text-inherit brightness-75'}
            `,
            hintClassName
          )}
        >
          {hint}
        </p>
      </div>
    )
  }
)
Input.displayName = 'Input'
