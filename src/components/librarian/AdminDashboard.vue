<template>
  <div>
    <nav class="navbar">
      <div class="navbar-left">IITM Central Librarian Portal 📕 😅</div>
      <ul>
        <li><router-link to="/requests">User Requests</router-link></li>
        <li><router-link to="/adminstats">Analytics</router-link></li>
        <li><router-link to="/">Logout</router-link></li>
      </ul>
    </nav>
  </div>
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
            <input type="file" @change="handleFileUpload" required />
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
      ebookFile: null,
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
      this.ebookFile = null;
      this.currentSectionId = null;
    },
    handleFileUpload(event) {
      this.ebookFile = event.target.files[0];
    },
    async saveEBook() {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('section_id', this.currentSectionId);
      formData.append('name', this.ebookName);
      formData.append('content', this.ebookContent);
      formData.append('author', this.ebookAuthor);
      formData.append('file', this.ebookFile);

      const response = await fetch('http://127.0.0.1:5000/ebooks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

<style scoped>


ul {
  list-style-type: none;
  display: flex;
  padding: 0;
}

ul li a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 10px 15px;
  transition: background-color 0.3s;
}

ul li a:hover {
  background-color: #34495e;
}

.card {
  background: white;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card h3 {
  color: #333;
  margin: 0 0 10px 0;
}

.button-row {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}

button {
  padding: 6px 12px;
  margin-right: 5px;
  font-size: 0.875rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

/* Enhanced form styling */
.form-section {
  background: #ecf0f1;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

input[type="text"], input[type="file"] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.ebook-item {
  background: #ecf0f1;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ebook-item h2 {
  font-size: 1rem;
  margin: 0;
  color: #333;
}
</style>
