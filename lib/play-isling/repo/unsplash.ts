import { createApi } from 'unsplash-js'

const unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''

const unsplash = createApi({
  accessKey: unsplashAccessKey,
})

export default unsplash
