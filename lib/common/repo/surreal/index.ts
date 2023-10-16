import { Surreal } from 'surrealdb.js'
import { EventEmitter } from 'events'

const surrealURL = process.env.NEXT_PUBLIC_SURREAL_URL || ''
const surrealNS = process.env.NEXT_PUBLIC_SURREAL_NS || ''
const surrealDB = process.env.NEXT_PUBLIC_SURREAL_DB || ''
const surrealUser = process.env.NEXT_PUBLIC_SURREAL_USER || ''
const surrealPass = process.env.NEXT_PUBLIC_SURREAL_PASS || ''

export const surreal = {
  db: new Surreal(),
  connected: false,
  event: new EventEmitter(),
  getConn() {
    return surreal.db
  },
  waitConnected() {
    return new Promise((resolve, reject) => {
      let connectAttemptLeft = 80

      const id = setInterval(() => {
        if (!surreal.connected || surreal.db.status !== 0) {
          connectAttemptLeft -= 1

          if (connectAttemptLeft === 0) {
            clearInterval(id)
            reject(new Error('timeout error'))
          }

          return
        }

        resolve(surreal.db)
        clearInterval(id)
      }, 100)
    })
  },
  async signin() {
    await surreal.db.connect(surrealURL, {
      async prepare(db) {
        try {
          await db.use({ ns: surrealNS, db: surrealDB })

          const token =
            typeof window !== 'undefined' &&
            localStorage.getItem('surreal_session')

          try {
            if (!token) throw new Error('throw error to go to signin scope')

            await db.authenticate(token)

            if (surreal.connected) {
              surreal.event.emit('reconnected')
            }
            surreal.connected = true
            console.log('surreal: login by token success')
          } catch (err) {
            localStorage.removeItem('surreal_session')

            const newToken = await db.signin({
              user: surrealUser,
              pass: surrealPass,
            })

            if (!newToken) throw new Error('surreal: did not receive token')
            localStorage.setItem('surreal_session', newToken)

            if (surreal.connected) {
              surreal.event.emit('reconnected')
            }
            surreal.connected = true
            console.log('surreal: login by password success')
          }

          window.addEventListener('focus', () => {
            surreal.autoReconnect()
          })

          window.addEventListener('beforeunload', () => {
            if (surreal.intervalId) {
              clearInterval(surreal.intervalId)
            }
          })
        } catch (err) {
          console.error('surreal: initial:', (err as Error).message)
        }
      },
    })

    return surreal.db
  },
  intervalId: null as NodeJS.Timer | null,
  autoReconnect() {
    const checkConnection = async () => {
      try {
        let shouldReconnect = surreal.connected && surreal.db.status !== 0

        if (!shouldReconnect) {
          try {
            await surreal.db.ping().catch(() => {
              shouldReconnect = true
            })
          } catch (err) {
            console.debug('ping error', err)
          }
        }

        console.debug(
          'check surreal connection',
          shouldReconnect ? 'need reconnect' : 'ok'
        )

        if (shouldReconnect) {
          console.warn('surreal disconnected')

          await surreal.signin()
        }
      } catch (err) {
        console.error('reconnect surreal error', err)
      }
    }

    if (surreal.intervalId) {
      clearInterval(surreal.intervalId)
    }
    surreal.intervalId = setInterval(() => checkConnection(), 5000)
  },
}
