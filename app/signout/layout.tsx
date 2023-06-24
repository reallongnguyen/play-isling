import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Sign Out — isling',
  description: "Let's watch videos together",
  icons: '/favicon.ico',
}

export default function SignOutLayout({
  children,
}: PropsWithChildren<unknown>) {
  return children
}
