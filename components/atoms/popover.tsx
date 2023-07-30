'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { AlertTriangle } from 'lucide-react'
import { Button } from './button'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }

export interface ConfirmationProps {
  title: string
  description?: string
  disabled?: boolean
  onYes?: () => void
  onNo?: () => void
}

export function Confirmation(
  props: React.PropsWithChildren<ConfirmationProps>
) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled}>
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="p-0" side="top">
        <Alert variant="default" className="border-0">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>{props.title}</AlertTitle>
          {props.description && (
            <AlertDescription>{props.description}</AlertDescription>
          )}
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              size="sm"
              className="px-4 mt-2"
              onClick={props.onYes}
            >
              Yes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-4 mt-2"
              onClick={() => {
                if (props.onNo) {
                  props.onNo()
                }

                setOpen(false)
              }}
            >
              No
            </Button>
          </div>
        </Alert>
      </PopoverContent>
    </Popover>
  )
}
