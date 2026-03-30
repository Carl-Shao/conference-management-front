import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from './utils/storage'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('./pages/MeetingList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history-list',
    name: 'HistoryList',
    component: () => import('./pages/HistoryList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/meeting-room/:id',
    name: 'MeetingRoom',
    component: () => import('./pages/MeetingRoom.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history-detail/:id',
    name: 'HistoryDetail',
    component: () => import('./pages/HistoryDetail.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = getToken()
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
