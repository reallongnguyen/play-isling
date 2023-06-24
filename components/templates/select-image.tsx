/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../atoms/dialog'
import {
  ChangeEvent,
  FormEvent,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react'
import { DialogHeader } from '../atoms/dialog'
import { Input } from '../atoms/input'
import unsplash from '@/lib/play-isling/repo/unsplash'
import { Button } from '../atoms/button'
import { Basic } from 'unsplash-js/dist/methods/photos/types'

export interface SelectImageProps {
  onSelectImage?: (imageURL: string) => void
}

export default function SelectImage({
  children,
  onSelectImage,
}: PropsWithChildren<SelectImageProps>) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [images, setImages] = useState<Basic[]>([])

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setKeyword(e.target.value)

  const searchUnsplash = useCallback(async (query) => {
    const res = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 12,
      orientation: 'portrait',
    })
    if (!res || !res.response || res.response.results.length === 0) {
      const imgJSON = localStorage.getItem('splashImage')
      if (!imgJSON) {
        return
      }

      const images = JSON.parse(imgJSON)
      setImages(images)
      return
    }

    localStorage.setItem('splashImage', JSON.stringify(res.response.results))
    setImages(res.response.results)
  }, [])

  const handlerSearch = (e: FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    searchUnsplash(keyword)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[1024px] min-h-[556.78px]">
        <div className="grid grid-rows-[auto_auto_1fr] h-full">
          <DialogHeader>
            <DialogTitle>Select a Room cover</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handlerSearch}
            className="flex justify-center space-x-2 mt-2"
          >
            <Input
              placeholder="Search image on Unsplash"
              className="w-96 rounded-full"
              value={keyword}
              onChange={handleSearchInputChange}
            />
            <Button type="submit">Search</Button>
          </form>
          <div className="grid grid-cols-4 gap-2 overflow-y-auto h-full">
            {images.map((img) => (
              <div
                className="aspect-video overflow-hidden rounded cursor-pointer hover:brightness-90 active:scale-105"
                key={img.id}
                onClick={() => {
                  if (onSelectImage) {
                    onSelectImage(img.urls.small)
                  }
                  setTimeout(() => {
                    setOpen(false)
                  }, 100)
                }}
              >
                <img
                  className="object-cover w-full h-full"
                  src={img.urls.small}
                  alt={img.description || img.id}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
