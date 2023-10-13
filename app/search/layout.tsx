import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export const metadata: Metadata = {
  title: 'Search — isling',
  icons: '/favicon.ico',
  openGraph: {
    siteName: 'Search — isling',
    url: `${websiteURL}/search`,
    type: 'website',
    title: 'Search — isling',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=480&q=80',
      },
    ],
  },
  robots: 'index, follow',
}

export default async function SearchLayout(props: PropsWithChildren<unknown>) {
  return props.children
}
