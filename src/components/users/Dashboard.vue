
<template>
    <div class="dashboard">
        <nav class="navbar">
            <div class="navbar-left">IITM 24/7 Mad2 Library</div>
            <ul>
                <li><router-link to="/mybooks">Mybooks</router-link></li>
                <li><a href="https://razorpay.com/demo/" >Payments</a></li>
                <li><router-link to="/">Logout</router-link></li>
            </ul>
        </nav>
        <h2>User Dashboard</h2>
        <div>
            <div class="search-container">
                <input v-model="searchQuery" placeholder="Search sections or e-books" @input="searchContent" />
            </div>
        </div>
        <div v-if="filteredSections.length">
            <h1>Sections</h1>
            <div class="section" v-for="section in filteredSections" :key="section.id">
                <h4>{{ section.name }}</h4>
                <ul class="book-list">
                <li class="book-item" v-for="ebook in section.ebooks" :key="ebook.id">
                    <h2>{{ ebook.name }}</h2>
                    <p>{{ ebook.author }}</p>
                    <button @click="requestEbook(ebook)">Request</button>
                </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <p>No sections or e-books found.</p>
        </div>
        <div v-if="selectedEbook" class="request-ebook-container">
            <h4>Request E-Book: {{ selectedEbook.name }}</h4>
            <form @submit.prevent="submitRequest" class="request-form">
                <div class="form-group">
                <label for="days">Number of days:</label>
                <select v-model="requestDays" id="days" class="select-days">
                    <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
                </select>
                </div>
                <button type="submit" class="btn-submit">Submit Request</button>
                <button @click="selectedEbook = null" class="btn-cancel">Cancel</button>
            </form>
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
            setTimeout(() => this.message = '', 3000); 
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

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.search-container input {
  width: 50%;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #1a237e;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-container input:focus {
  border-color: #000f0e; 
}

.dashboard {
  padding: 20px;
}

.section {
  background: #f7f7f7;
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

h2, h4 {
  color: #1a237e;
}

.book-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

.book-item {
  background: white;
  margin: 10px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: calc(25% - 20px); 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

h5, p {
  margin-bottom: 10px;
}

button {
  background-color: #004089;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #000000;
}
.request-ebook-container {
  padding: 20px;
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.request-form {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.select-days {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fafafa;
}

.btn-submit, .btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-submit {
  background-color: #281270;
  color: white;
}

.btn-submit:hover {
  background-color: #2547a5;
}

.btn-cancel {
  background-color: #f04e4e;
  color: white;
}

.btn-cancel:hover {
  background-color: #ec221f;
}

</style>
