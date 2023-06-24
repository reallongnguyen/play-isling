'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Align, Side } from '@radix-ui/react-popper'

import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-[60] overflow-hidden rounded-md border bg-popover -ml-3 px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export interface TooltipProps {
  content?: string
  className?: string
  triggerAsChild?: boolean
  align?: Align
  side?: Side
}

function Tooltip({
  children,
  content,
  className,
  triggerAsChild,
  align = 'center',
  side = 'top',
}: React.PropsWithChildren<TooltipProps>) {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild={triggerAsChild}>{children}</TooltipTrigger>
        <TooltipContent className={className} align={align} side={side}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider }
