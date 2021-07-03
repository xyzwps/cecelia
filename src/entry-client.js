import { createApp } from './main'
import { v4 as uuidv4 } from 'uuid'

const syncState = window.__syncState__

const tokenKey = 'token'
const uuidKey = 'uuid'
const token = window.localStorage.getItem(tokenKey) || ''
let UUID = window.localStorage.getItem(uuidKey)
if (!UUID) {
  UUID = uuidv4()
  window.localStorage.setItem(uuidKey, UUID)
}

const context = {
  token,
  UUID,
  host: window.location.origin,
  ua: navigator.userAgent,
  resetToken: token => {
    window.localStorage.setItem(tokenKey, token)
  }
}
const { app, router, interact, session, request } = createApp(context, syncState)

session.setUserProfile(null, request)

const { progressBar } = interact
router.isReady().then(() => {
  router.beforeEach((to, from) => {
    progressBar.start()
    return true
  })
  router.afterEach((to, from) => {
    progressBar.end()
    return true
  })

  app.mount('#app')
})
