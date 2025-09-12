<template>
  <div>
    <h2>Create User</h2>
    <input v-model="username" placeholder="Enter username" />
    <button @click="createUser">Create</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      message: ''
    };
  },
  methods: {
    async createUser() {
      try {
        const response = await axios.post('http://localhost:5000/users', { username: this.username });
        this.message = `User ${response.data.username} created!`;
      } catch (err) {
        this.message = 'Error creating user';
      }
    }
  }
};
</script>
