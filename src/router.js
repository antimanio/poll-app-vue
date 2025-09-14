import { createRouter, createWebHistory } from 'vue-router'
import CreateUser from './components/CreateUser.vue'
import CreatePoll from './components/CreatePoll.vue'
import TheWelcome from './components/TheWelcome.vue'

const routes = [
  { path: '/', component: CreateUser },
  { path: '/createPoll', component: CreatePoll },
  { path: '/about', component: TheWelcome }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router