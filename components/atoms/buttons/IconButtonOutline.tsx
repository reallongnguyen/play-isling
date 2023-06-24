/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonHTMLAttributes, FC, HTMLProps } from 'react'

export type ControllerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const IconButtonOutline: FC<HTMLProps<HTMLButtonElement>> = (props) => (
  <button
    {...(props as any)}
    className={`
      w-9 h-9 border rounded-full flex justify-center items-center transition-all duration-100
      ${
        props.disabled
          ? 'border-secondary/5'
          : 'border-secondary/20 active:scale-95 hover:bg-primary-light/40 cursor-pointer'
      }
      ${props.className}
    `}
  >
    {props.children}
  </button>
)

export default IconButtonOutline
