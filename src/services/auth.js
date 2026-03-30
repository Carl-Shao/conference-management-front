import api from './api'

export function login(data) {
  return api.post('/auth/login', data)
}

export function logout() {
  return api.post('/auth/logout')
}

export function checkAuth() {
  return api.get('/auth/check')
}
