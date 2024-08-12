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
        }, 2000); 
      })
      .catch(error => {
        this.message = 'Invalid admin credentials.';
      });
    }
  }
};
</script>

<style scoped>
.admin-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input[type="email"], input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  background-color: #5c67f2;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4a54e1;
}

p {
  color: #e63946;
  margin-top: 15px;
}
</style>
