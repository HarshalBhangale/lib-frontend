<template>
<div class="dashboard">
    <nav class="navbar">
      <div class="navbar-left">IITM 24/7 Mad2 Library</div>
      <ul>
        <li><router-link to="/mybooks">Mybooks</router-link></li>
        <!-- <li><router-link to="/stats">Analytics</router-link></li> -->
        <li><router-link to="/">Logout</router-link></li>
      </ul>
    </nav>
    <h2>User Dashboard</h2>
    <div>
    <input v-model="searchQuery" placeholder="Search sections or e-books" @input="searchContent" />
    </div>
    <div v-if="filteredSections.length">
    <h3>Sections</h3>
    <div v-for="section in filteredSections" :key="section.id">
        <h4>{{ section.name }}</h4>
        <ul>
        <li v-for="ebook in section.ebooks" :key="ebook.id">
            {{ ebook.name }} by {{ ebook.author }}
            <button @click="requestEbook(ebook)">Request</button>
        </li>
        </ul>
    </div>
    </div>
    <div v-else>
    <p>No sections or e-books found.</p>
    </div>
    <div v-if="selectedEbook">
    <h4>Request E-Book: {{ selectedEbook.name }}</h4>
    <form @submit.prevent="submitRequest">
        <label for="days">Number of days:</label>
        <select v-model="requestDays" id="days">
        <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
        </select>
        <button type="submit">Submit Request</button>
    </form>
    <button @click="selectedEbook = null">Cancel</button>
    </div>
    <p v-if="message">{{ message }}</p>
</div>
</template>

<script>
export default {
data() {
    return {
    sections: [],
    searchQuery: '',
    filteredSections: [],
    selectedEbook: null,
    requestDays: 1,
    message: ''
    };
},
async created() {
    const token = localStorage.getItem('token');
    if (!token) {
    this.$router.push('/login');
    return;
    }
    try {
    const response = await fetch('http://127.0.0.1:5000/sections', {
        headers: {
        Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 403) {
        this.$router.push('/login');
        return;
    }
    if (response.ok) {
        this.sections = await response.json();
        this.filteredSections = this.sections;
    }
    } catch (error) {
        console.error('Error fetching sections:', error);
    }
},
methods: {
    searchContent() {
    if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        this.filteredSections = this.sections.filter(section =>
        section.name.toLowerCase().includes(query) ||
        section.ebooks.some(ebook =>
            ebook.name.toLowerCase().includes(query) ||
            ebook.author.toLowerCase().includes(query)
        )
        );
    } else {
        this.filteredSections = this.sections;
    }
    },
    requestEbook(ebook) {
    this.selectedEbook = ebook;
    },
    async submitRequest() {
    const token = localStorage.getItem('token');
    if (!token) {
        this.$router.push('/login');
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:5000/ebooks/${this.selectedEbook.id}/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ days: this.requestDays })
        });
        if (response.status === 403) {
        this.$router.push('/login');
        return;
        }
        if (response.ok) {
        this.message = 'E-Book requested successfully!';
        this.selectedEbook = null;
        setTimeout(() => this.message = '', 3000); // Clear message after 3 seconds
        } else {
        const result = await response.json();
        this.message = result.message || 'Failed to request e-book.';
        }
    } catch (error) {
        console.error('Error requesting e-book:', error);
        this.message = 'An error occurred during the request.';
    }
    }
}
};
</script>

<style>
/* Add your styles here */
</style>
