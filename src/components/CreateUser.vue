<template>
  <div>
    <!-- Create button -->
    <Button label="Create User" icon="pi pi-check" @click="createUser" />

    <!-- Load users button -->
    <Button label="Load Users" icon="pi pi-users" @click="getUsers" class="ml-2" />

    <!-- Show feedback message -->
    <p>{{ message }}</p>

    <!-- Show list of users -->
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// state variables
const username = ref('')
const message = ref('')
const users = ref([])

// create user
const createUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/users', { username: username.value, email: "anton@hvl.no"  })
    message.value = `User ${response.data.username} created!`
  } catch (err) {
    message.value = 'Error creating user'
  }
}

// fetch all users
const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/users')
    users.value = response.data
    message.value = 'Users loaded!'
  } catch (err) {
    message.value = 'Error fetching users'
  }
}

</script>
