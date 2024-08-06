<template>
<div class="home">
    <h1>Welcome to the Library Management System</h1>
    <div class="buttons">
    <button @click="navigateTo('adminlogin')">Admin Login</button>
    <button @click="navigateTo('register')">Register</button>
    <button @click="navigateTo('login')">Login</button>
    </div>
</div>
</template>

<script>
export default {
name: 'Home',
methods: {
    navigateTo(route) {
    this.$router.push({ path: `/${route}` });
    },
},
};
</script>
<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
}

.buttons {
  display: flex;
  flex-direction: row; /* Change to row to align buttons horizontally */
  gap: 15px; /* Space between buttons */
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  transform: scale(0.98);
}
</style>