<!-- <template>
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
        books: [],
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
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        const response = await fetch(`http://127.0.0.1:5000/ebooks/${filePath}`, {
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
      }
    }
  };
  </script>
  
  <style>
  .my-books {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    margin: 10px 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  button {
    margin: 5px;
    padding: 8px 15px;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
    color: white;
  }
  </style>
   -->
   <template>
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
        books: [],
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
      }
    }
  };
  </script>
  
  <style>
  .my-books {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    margin: 10px 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  button {
    margin: 5px;
    padding: 8px 15px;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
    color: white;
  }
  </style>
  