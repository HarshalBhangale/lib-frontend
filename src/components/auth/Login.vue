<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="message" class="error-message">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.access_token);
          this.$router.push('/dashboard');
        } else {
          this.message = result.message;
        }
      } catch (error) {
        this.message = 'An error occurred during login.';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 60px;
  width: 100%;
  max-width: 280px;
  text-align: center;
}

h1 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 15px;
}

input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 0.875rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #d9534f;
  font-size: 0.75rem;
  margin-top: 10px;
}
</style>
