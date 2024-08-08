import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/auth/Home.vue'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import AdminLogin from '@/components/auth/AdminLogin.vue'
import LibrarianDashboard from '@/components/librarian/AdminDashboard.vue'
import UserDashboard from '@/components/users/Dashboard.vue'
import requests from '@/components/librarian/requests.vue'
import mybooks from '@/components/users/mybooks.vue'
import adminstats from '@/components/librarian/AdminStats.vue'
const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/adminlogin', component: AdminLogin },
    { path: '/admindashboard', component: LibrarianDashboard },
    { path: '/dashboard', component: UserDashboard },
    { path: '/requests', component: requests },
    { path: '/mybooks', component: mybooks },
    { path: '/adminstats', component: adminstats }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
