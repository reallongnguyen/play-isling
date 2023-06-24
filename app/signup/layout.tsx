import { Metadata } from 'next'
import Image from 'next/image'
import { PropsWithChildren } from 'react'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export const metadata: Metadata = {
  title: 'Sign Up — isling',
  description: 'Create a free account on Isling.Play',
  icons: '/favicon.ico',
  openGraph: {
    siteName: 'Isling',
    url: `${websiteURL}/signup`,
    type: 'music.playlist',
    title: 'Sign Up — isling',
    description: "Create a free account. Let's watch videos together",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80',
      },
    ],
  },
  robots: 'index, follow',
}

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <>
      <div className="fixed w-screen h-screen blur-3xl z-0 opacity-10">
        <Image
          src="https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80"
          alt="Sign Up"
          fill
          unoptimized
        />
      </div>
      <div className="fixed z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </>
  )
}
