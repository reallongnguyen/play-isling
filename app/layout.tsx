import { PropsWithChildren } from 'react'
import { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from '@/components/atoms/toaster'
import GlobalDialog from '@/components/organisms/GlobalDialog'
import VideoPlayer from '@/components/templates/video-player'

import Providers from './providers'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export const metadata: Metadata = {
  title: 'Isling Play',
  description: "Let's watch videos together",
  icons: '/favicon.ico',
  openGraph: {
    siteName: 'Isling Play',
    url: websiteURL,
    type: 'website',
    title: 'Watch Video Together — isling',
    description: "Let's watch videos together",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      },
    ],
  },
  robots: 'index, follow',
}

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimal-ui"
        />
      </head>
      <body className="dark">
        <Providers>
          <GlobalDialog />
          <Toaster />
          <VideoPlayer />
          <main id="app">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
