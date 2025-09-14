import { createRouter, createWebHistory } from 'vue-router'
import CreateUser from './components/CreateUser.vue'
import CreatePoll from './components/CreatePoll.vue'
import Vote from './components/Vote.vue'

const routes = [
  { path: '/', component: CreateUser },
  { path: '/poll', component: CreatePoll },
  { path: '/vote', component: Vote }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router