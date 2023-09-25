import { Surreal } from 'surrealdb.js'

const surrealURL = process.env.NEXT_PUBLIC_SURREAL_URL || ''
const surrealNS = process.env.NEXT_PUBLIC_SURREAL_NS || ''
const surrealDB = process.env.NEXT_PUBLIC_SURREAL_DB || ''
const surrealUser = process.env.NEXT_PUBLIC_SURREAL_USER || ''
const surrealPass = process.env.NEXT_PUBLIC_SURREAL_PASS || ''

export const db = new Surreal()
let connected = false

export const waitSurreal = () =>
  new Promise((resolve) => {
    const id = setInterval(() => {
      if (!connected || db.status !== 0) {
        return
      }

      resolve(db)
      clearInterval(id)
      console.log('surreal connected')
    }, 100)
  })

const signin = async () => {
  await db.connect(surrealURL, {
    async prepare(db) {
      try {
        await db.use({ ns: surrealNS, db: surrealDB })

        const token =
          typeof window !== 'undefined' &&
          localStorage.getItem('surreal_session')

        try {
          if (!token) throw new Error('throw error to go to signin scope')

          await db.authenticate(token)

          connected = true
          console.log('surreal: login by token success')
        } catch (err) {
          localStorage.removeItem('surreal_session')

          const newToken = await db.signin({
            user: surrealUser,
            pass: surrealPass,
          })

          if (!newToken) throw new Error('surreal: did not receive token')
          localStorage.setItem('surreal_session', newToken)

          connected = true
          console.log('surreal: login by password success')
        }
      } catch (err) {
        console.error('surreal: initial:', (err as Error).message)
      }
    },
  })

  return db
}

export default signin
