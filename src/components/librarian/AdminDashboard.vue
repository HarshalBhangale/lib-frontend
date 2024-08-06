<!-- <template>
    <div>
    <div class="dashboard">
      <h1>Librarian Dashboard</h1>
      </div>
        <h2>Sections</h2>
        <button @click="toggleSectionForm">Add Section</button>
        <div v-if="showSectionForm">
          <h3>{{ editSectionId ? 'Edit Section' : 'Add Section' }}</h3>
          <form @submit.prevent="saveSection">
            <input v-model="sectionName" placeholder="Section Name" required />
            <button type="submit">{{ editSectionId ? 'Update' : 'Add' }}</button>
            <button @click="cancelSectionEdit">Cancel</button>
          </form>
        </div>
        <ul>
          <li v-for="section in sections" :key="section.id">
            {{ section.name }}
            <button @click="editSection(section)">Edit</button>
            <button @click="deleteSection(section.id)">Delete</button>
            <button @click="toggleEBookForm(section.id)">Add E-Book</button>
            <div v-if="showEBookForm && currentSectionId === section.id">
              <h3>Add E-Book</h3>
              <form @submit.prevent="saveEBook">
                <input v-model="ebookName" placeholder="E-Book Name" required />
                <input v-model="ebookContent" placeholder="Content" required />
                <input v-model="ebookAuthor" placeholder="Author" required />
                <button type="submit">Add</button>
                <button @click="cancelEBookEdit">Cancel</button>
              </form>
            </div>
            <ul>
              <li v-for="ebook in section.ebooks" :key="ebook.id">
                {{ ebook.name }} by {{ ebook.author }}
                <button @click="editEBook(ebook, section.id)">Edit</button>
                <button @click="deleteEBook(ebook.id, section.id)">Delete</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeUsers: 0,
        totalSections: 0,
        totalEbooks: 0,
        sections: [],
        sectionName: '',
        editSectionId: null,
        showSectionForm: false,
        showEBookForm: false,
        currentSectionId: null,
        ebookName: '',
        ebookContent: '',
        ebookAuthor: '',
      };
    },
    async created() {
      const token = localStorage.getItem('token');
      const dashboardResponse = await fetch('http://127.0.0.1:5000/admindashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (dashboardResponse.status === 401) {
        this.$router.push('/login');
        return;
      }
      const dashboardData = await dashboardResponse.json();
      this.activeUsers = dashboardData.active_users;
      this.totalSections = dashboardData.total_sections;
      this.totalEbooks = dashboardData.total_ebooks;
  
      const sectionsResponse = await fetch('http://127.0.0.1:5000/sections', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (sectionsResponse.status === 401) {
        this.$router.push('/login');
        return;
      }
      this.sections = await sectionsResponse.json();
    },
    methods: {
      toggleSectionForm() {
        this.showSectionForm = !this.showSectionForm;
      },
      cancelSectionEdit() {
        this.showSectionForm = false;
        this.sectionName = '';
        this.editSectionId = null;
      },
      async saveSection() {
        const token = localStorage.getItem('token');
        const url = this.editSectionId ? `http://127.0.0.1:5000/sections/${this.editSectionId}` : 'http://127.0.0.1:5000/sections';
        const method = this.editSectionId ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: this.sectionName }),
        });
        if (response.ok) {
          const sectionData = await response.json();
          if (this.editSectionId) {
            const index = this.sections.findIndex(section => section.id === this.editSectionId);
            this.sections.splice(index, 1, sectionData);
          } else {
            this.sections.push(sectionData);
          }
          this.cancelSectionEdit();
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      editSection(section) {
        this.sectionName = section.name;
        this.editSectionId = section.id;
        this.showSectionForm = true;
      },
      async deleteSection(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/sections/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          this.sections = this.sections.filter(section => section.id !== id);
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      toggleEBookForm(sectionId) {
        this.showEBookForm = !this.showEBookForm;
        this.currentSectionId = sectionId;
      },
      cancelEBookEdit() {
        this.showEBookForm = false;
        this.ebookName = '';
        this.ebookContent = '';
        this.ebookAuthor = '';
        this.currentSectionId = null;
      },
      async saveEBook() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/ebooks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            section_id: this.currentSectionId,
            name: this.ebookName,
            content: this.ebookContent,
            author: this.ebookAuthor,
          }),
        });
        if (response.ok) {
          const ebookData = await response.json();
          const sectionIndex = this.sections.findIndex(section => section.id === this.currentSectionId);
          this.sections[sectionIndex].ebooks.push(ebookData);
          this.cancelEBookEdit();
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      async deleteEBook(id, sectionId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/ebooks/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const sectionIndex = this.sections.findIndex(section => section.id === sectionId);
          this.sections[sectionIndex].ebooks = this.sections[sectionIndex].ebooks.filter(ebook => ebook.id !== id);
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      editEBook(ebook, sectionId) {
        this.ebookName = ebook.name;
        this.ebookContent = ebook.content;
        this.ebookAuthor = ebook.author;
        this.currentSectionId = sectionId;
        this.showEBookForm = true;
      },
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
   -->
   <template>
    <div class="dashboard">
      <h1>Librarian Dashboard</h1>
      <h2>Sections</h2>
      <button @click="toggleSectionForm" class="btn-primary">Add Section</button>
      <div v-if="showSectionForm">
        <h3>{{ editSectionId ? 'Edit Section' : 'Add Section' }}</h3>
        <form @submit.prevent="saveSection" class="form-section">
          <input v-model="sectionName" placeholder="Section Name" required />
          <button type="submit" class="btn-primary">{{ editSectionId ? 'Update' : 'Add' }}</button>
          <button @click="cancelSectionEdit" class="btn-secondary">Cancel</button>
        </form>
      </div>
      <div class="section-list">
        <div v-for="section in sections" :key="section.id" class="card">
          <h3>{{ section.name }}</h3>
          <button @click="editSection(section)" class="btn-primary">Edit</button>
          <button @click="deleteSection(section.id)" class="btn-danger">Delete</button>
          <button @click="toggleEBookForm(section.id)" class="btn-primary">Add E-Book</button>
          <div v-if="showEBookForm && currentSectionId === section.id" class="form-ebook">
            <h3>Add E-Book</h3>
            <form @submit.prevent="saveEBook" class="form-ebook-inner">
              <input v-model="ebookName" placeholder="E-Book Name" required />
              <input v-model="ebookContent" placeholder="Content" required />
              <input v-model="ebookAuthor" placeholder="Author" required />
              <button type="submit" class="btn-primary">Add</button>
              <button @click="cancelEBookEdit" class="btn-secondary">Cancel</button>
            </form>
          </div>
          <ul>
            <li v-for="ebook in section.ebooks" :key="ebook.id" class="ebook-item">
              {{ ebook.name }} by {{ ebook.author }}
              <button @click="editEBook(ebook, section.id)" class="btn-primary">Edit</button>
              <button @click="deleteEBook(ebook.id, section.id)" class="btn-danger">Delete</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sections: [],
        sectionName: '',
        editSectionId: null,
        showSectionForm: false,
        showEBookForm: false,
        currentSectionId: null,
        ebookName: '',
        ebookContent: '',
        ebookAuthor: '',
      };
    },
    async created() {
      const token = localStorage.getItem('token');
      await this.fetchSections(token);
    },
    methods: {
      async fetchSections(token) {
        const sectionsResponse = await fetch('http://127.0.0.1:5000/sections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (sectionsResponse.status === 401) {
          this.$router.push('/login');
          return;
        }
        this.sections = await sectionsResponse.json();
      },
      toggleSectionForm() {
        this.showSectionForm = !this.showSectionForm;
      },
      cancelSectionEdit() {
        this.showSectionForm = false;
        this.sectionName = '';
        this.editSectionId = null;
      },
      async saveSection() {
        const token = localStorage.getItem('token');
        const url = this.editSectionId ? `http://127.0.0.1:5000/sections/${this.editSectionId}` : 'http://127.0.0.1:5000/sections';
        const method = this.editSectionId ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: this.sectionName }),
        });
        if (response.ok) {
          const sectionData = await response.json();
          if (this.editSectionId) {
            const index = this.sections.findIndex(section => section.id === this.editSectionId);
            this.$set(this.sections, index, sectionData);
          } else {
            this.sections.push(sectionData);
          }
          this.cancelSectionEdit();
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      editSection(section) {
        this.sectionName = section.name;
        this.editSectionId = section.id;
        this.showSectionForm = true;
      },
      async deleteSection(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/sections/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          this.sections = this.sections.filter(section => section.id !== id);
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      toggleEBookForm(sectionId) {
        this.showEBookForm = !this.showEBookForm;
        this.currentSectionId = sectionId;
      },
      cancelEBookEdit() {
        this.showEBookForm = false;
        this.ebookName = '';
        this.ebookContent = '';
        this.ebookAuthor = '';
        this.currentSectionId = null;
      },
      async saveEBook() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/ebooks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            section_id: this.currentSectionId,
            name: this.ebookName,
            content: this.ebookContent,
            author: this.ebookAuthor,
          }),
        });
        if (response.ok) {
          const ebookData = await response.json();
          const sectionIndex = this.sections.findIndex(section => section.id === this.currentSectionId);
          this.sections[sectionIndex].ebooks.push(ebookData);
          this.cancelEBookEdit();
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      async deleteEBook(id, sectionId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/ebooks/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const sectionIndex = this.sections.findIndex(section => section.id === sectionId);
          this.sections[sectionIndex].ebooks = this.sections[sectionIndex].ebooks.filter(ebook => ebook.id !== id);
        } else if (response.status === 401) {
          this.$router.push('/login');
        }
      },
      editEBook(ebook, sectionId) {
        this.ebookName = ebook.name;
        this.ebookContent = ebook.content;
        this.ebookAuthor = ebook.author;
        this.currentSectionId = sectionId;
        this.showEBookForm = true;
      },
    },
  };
  </script>
  
  <style>
  .dashboard {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1, h2, h3 {
    margin: 10px 0;
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
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
  
  .btn-danger:hover {
    background-color: #c82333;
  }
  
  .form-section, .form-ebook-inner {
    margin-bottom: 20px;
  }
  
  input {
    display: block;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 0.9rem;
    width: 100%;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }
  
  .section-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .card {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    margin: 10px;
    width: calc(33% - 20px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .card h3 {
    margin-top: 0;
  }
  
  .form-ebook {
    margin-top: 10px;
  }
  
  .ebook-item {
    margin-bottom: 10px;
  }
  </style>
  