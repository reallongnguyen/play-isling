const surrealURL = process.env.NEXT_PUBLIC_SURREAL_URL || ''
const surrealNS = process.env.NEXT_PUBLIC_SURREAL_NS || ''
const surrealDB = process.env.NEXT_PUBLIC_SURREAL_DB || ''
const surrealUser = process.env.NEXT_PUBLIC_SURREAL_USER || ''
const surrealPass = process.env.NEXT_PUBLIC_SURREAL_PASS || ''

export const db = {
  connect(...params: any): any {
    console.log('')
  },
  signin(...params: any): any {
    console.log('')
  },
  query(...params: any): any {
    console.log('')
  },
  delete(...params: any): any {
    console.log('')
  },
  kill(...params: any): any {
    console.log('')
  },
  listenLive(...params: any): any {
    console.log('')
  },
}

const init = async () => {
  try {
    await db.connect(surrealURL, {
      ns: surrealNS,
      db: surrealDB,
    })

    await db.signin({
      user: surrealUser,
      pass: surrealPass,
    })

    console.log('surreal: initial success')
  } catch (err) {
    console.error('surreal: initial:', (err as Error).message)
  }

  return db
}

export default init
