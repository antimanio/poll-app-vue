import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export async function getUsers() {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    throw error
  }
}