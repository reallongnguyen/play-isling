import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from './label'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode
  hint?: React.ReactNode
  isError?: boolean
  wrapperClassName?: string
  hintClassName?: string
  labelClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          name={name}
          className={cn(
            `
              flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
              ${isError ? 'border-[#ff4d4f]' : 'border-input'}
            `,
            className
          )}
          required={required}
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
Textarea.displayName = 'Textarea'

export { Textarea }
