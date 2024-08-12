  <template>
    <nav class="navbar">
      <div class="navbar-left">IITM 24/7 Mad2 Library</div>
      <ul>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/">Logout</router-link></li>
      </ul>
    </nav>
    <div class="user-stats">
    <h1>My Statistics</h1>
    <div class="stats-grid">
      <div class="stat-box">
        <p>Books Requested</p>
        <span>{{ totalRequested }}</span>
      </div>
      <div class="stat-box">
        <p>Books Approved</p>
        <span>{{ totalApproved }}</span>
      </div>
      <div class="stat-box">
        <p>Books Rejected</p>
        <span>{{ totalRejected }}</span>
      </div>
      <div class="stat-box">
        <p>Books Revoked</p>
        <span>{{ totalRevoked }}</span>
      </div>
    </div>
  </div>
  <div class="my-books">
    <h2>My Books</h2>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Date Requested</th>
          <th>Return Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ new Date(book.date_requested).toLocaleDateString() }}</td>
          <td>{{ book.return_date ? new Date(book.return_date).toLocaleDateString() : 'N/A' }}</td>
          <td>{{ book.status }}</td>
          <td>
            <button v-if="book.status === 'Accepted'" @click="downloadBook(book.file_path)">Download</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalRequested: 0,
      totalApproved: 0,
      totalRejected: 0,
      totalRevoked: 0,
      books: [],
      message: ''
    };
  },
  async created() {
    const token = localStorage.getItem('token');
    await this.fetchUserStatistics(token);
    if (!token) {
      this.$router.push('/login');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/mybooks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 403) {
        this.$router.push('/login');
        return;
      }
      if (response.ok) {
        this.books = await response.json();
      } else {
        this.message = 'Failed to load books.';
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      this.message = 'An error occurred while fetching books.';
    }
  },
  methods: {
    async downloadBook(filePath) {
      if (!filePath) {
        this.message = 'No file available for download.';
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      const response = await fetch(`http://127.0.0.1:5000/ebooks/download?file_path=${encodeURIComponent(filePath)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        this.message = 'Failed to download the book.';
      }
    },
    async fetchUserStatistics(token) {
      try {
        const response = await fetch('http://127.0.0.1:5000/userstatistics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          this.$router.push('/login');
          return;
        }
        const data = await response.json();
        this.totalRequested = data.total_requests;
        this.totalApproved = data.total_approved;
        this.totalRejected = data.total_rejected;
        this.totalRevoked = data.total_revoked;
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    },
  }
};
</script>

<style>
.navbar {
  background-color: #1a237e;
  padding: 10px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left {
  font-size: 1.5rem;
  font-weight: bold;
}

ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

li a {
  text-decoration: none;
  color: white;
  font-weight: 500;
}

li a:hover {
  text-decoration: underline;
}

.user-stats, .my-books {
  padding: 20px;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 10px rgba(0,0,0,0.1);
}

h1, h2 {
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
}

.stat-box {
  background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.stat-box p {
  font-size: 1.1rem;
  color: #555;
}

.stat-box span {
  font-size: 2rem;
  font-weight: bold;
  color: #1a237e;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #3949ab;
  color: white;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

button {
  background-color: #3949ab;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #303f9f;
}

p {
  margin: 5px 0;
  color: #666;
}
</style>
