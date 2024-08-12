<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
        <p v-if="message" class="message">{{ message }}</p>
      </form>
      <p>Already registered? <router-link to="/login">Login here</router-link></p>
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
    async register() {
      try {
        const response = await fetch('http://127.0.0.1:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        const result = await response.json();
        if (response.ok) {
          this.message = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000); // Redirect after 2 seconds
        } else {
          this.message = result.message;
        }
      } catch (error) {
        this.message = 'An error occurred during registration.';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
}

input {
  width: calc(100% - 20px);
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.message {
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 15px;
}
</style>
