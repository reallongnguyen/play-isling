import Profile from '@/lib/account/models/profile'
import { LoadingScreen } from '../../atoms/loading-skeleton'
import HomeHeader from '../headers/HomeHeader'
import { PropsWithChildren } from 'react'

export interface DefaultLayoutProps {
  isLoading?: boolean
  userProfile: Profile
}

export function DefaultLayout(props: PropsWithChildren<DefaultLayoutProps>) {
  return (
    <>
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        <HomeHeader />
      </header>
      {props.isLoading && <LoadingScreen />}
      <div className="h-12" />
      <div className="container-lg">{props.children}</div>
      <div className="h-28" />
    </>
  )
}
