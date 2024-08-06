<template>
  <div class="admin-login">
    <h1>Admin Login</h1>
    <form @submit.prevent="handleAdminLogin">
      <div>
        <label for="email">Email ID:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Admin Login</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: 'admin@gmail.com',
      password: 'admin',
      message: ''
    };
  },
  methods: {
    handleAdminLogin() {
      axios.post('http://127.0.0.1:5000/adminLogin', {
        email: this.email,
        password: this.password,
      })
      .then(response => {
        this.message = 'Admin Login successful! Redirecting to admin dashboard...';
        localStorage.setItem('token', response.data.access_token);
        setTimeout(() => {
          this.$router.push('/admindashboard');
        }, 2000); // Redirect after 2 seconds
      })
      .catch(error => {
        this.message = 'Invalid admin credentials.';
      });
    }
  }
};
</script>

<style>
/* Add your styles here */
</style>
