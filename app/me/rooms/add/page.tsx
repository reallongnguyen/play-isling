'use client'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import { Textarea } from '@/components/atoms/textarea'
import PageHeader from '@/components/organisms/page-header'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import SelectImage from '@/components/templates/select-image'
import useCreateRoom from '@/lib/play-isling/usecases/room/useCreateRoom'
import Image from 'next/image'
import { IoImageOutline } from 'react-icons/io5'

export default function AddRoomPage() {
  const { userProfile, createRoomForm, isCreating, createRoom } =
    useCreateRoom()

  const setCover = (imageURL: string) => {
    createRoomForm.setValue('cover', imageURL)
    createRoomForm.formState.errors.cover = undefined
  }

  if (!userProfile) {
    return (
      <>
        <LoadingHeader />
        <LoadingScreen />
      </>
    )
  }

  return (
    <>
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        <HomeHeader userProfile={userProfile} />
      </header>
      <div className="h-12" />
      <div className="container-md">
        <PageHeader pageName="Create Room" className="mb-8" />
        <form onSubmit={createRoomForm.handleSubmit(createRoom)}>
          <div className="flex">
            <div>
              <SelectImage onSelectImage={setCover}>
                <div
                  className={`
                  w-80 aspect-video bg-primary-light rounded-lg relative cursor-pointer overflow-hidden
                  ${
                    createRoomForm.formState.errors.cover
                      ? 'border-[#ff4d4f] border'
                      : ''
                  }
                `}
                >
                  {createRoomForm.watch('cover') && (
                    <Image
                      className="object-cover"
                      src={createRoomForm.watch('cover')}
                      fill
                      alt="cover"
                    />
                  )}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-light/10 p-1">
                    <div className="flex justify-center">
                      <IoImageOutline className="text-4xl text-secondary" />
                    </div>
                    <p className="text-secondary">Select a cover image</p>
                  </div>
                </div>
              </SelectImage>
            </div>
            <div className="ml-4 flex-1">
              <Input
                label="Room name"
                required
                type="text"
                className="w-full"
                autoFocus
                isError={!!createRoomForm.formState.errors.name}
                hint={createRoomForm.formState.errors.name?.message}
                {...createRoomForm.register('name', {
                  required: 'Room name is required',
                })}
              />
              <Textarea
                label="Description"
                className="w-full min-h-[60px]"
                hintClassName="hidden"
                {...createRoomForm.register('description')}
              />
            </div>
          </div>
          <Input
            className="hidden"
            isError={!!createRoomForm.formState.errors.cover}
            hint={createRoomForm.formState.errors.cover?.message}
            {...createRoomForm.register('cover', {
              required: 'Cover is required',
            })}
          />
          <div className="mt-8">
            <Button
              type="submit"
              variant="highlight"
              className="w-32"
              disabled={isCreating}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
