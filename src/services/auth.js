import api from './api'

export function login(data) {
  return api.post('/login', data)
}

export function logout() {
  return api.post('/logout')
}

export function checkAuth() {
  return api.get('/check')
}
