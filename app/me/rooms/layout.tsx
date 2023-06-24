import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export const metadata: Metadata = {
  title: 'Your rooms — isling',
  description: "Let's watch videos together",
  icons: '/favicon.ico',
  openGraph: {
    siteName: 'Isling',
    url: `${websiteURL}/me/rooms`,
    type: 'music.playlist',
    title: 'Your rooms — isling',
    description: "Let's watch videos together",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80',
      },
    ],
  },
  robots: 'index, follow',
}

export default function MyRoomsLayout({
  children,
}: PropsWithChildren<unknown>) {
  return <>{children}</>
}
