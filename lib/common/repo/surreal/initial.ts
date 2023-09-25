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

        if (!token) {
          return
        }

        const ok = await db.authenticate(token)

        if (ok) {
          connected = true
          console.log('surreal: login by token success')
        }

        if (!ok) {
          localStorage.removeItem('surreal_session')

          await db
            .signin({
              user: surrealUser,
              pass: surrealPass,
            })
            .then((token) => {
              if (!token) throw new Error('surreal: did not receive token')
              localStorage.setItem('surreal_session', token)

              connected = true
              console.log('surreal: login by password success')
            })
        }
      } catch (err) {
        console.error('surreal: initial:', (err as Error).message)
      }
    },
  })

  return db
}

export default signin
