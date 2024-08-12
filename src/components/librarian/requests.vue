<template>
  <nav class="navbar">
    <div class="navbar-left">IITM Central Librarian Portal 📕 😅</div>
    <ul>
      <li><router-link to="/adminstats">Analytics</router-link></li>
      <li><router-link to="/admindashboard">Admin Dashboard</router-link></li>
      <li><router-link to="/">Logout</router-link></li>
    </ul>
  </nav>
  <div class="requests">
    <h2>User Requests</h2>
    <button @click="exportData" class="btn-primary">Export Data as CSV</button>
    <table>
      <thead>
        <tr>
          <th>E-Book Title</th>
          <th>Author</th>
          <th>Requested By (User ID)</th>
          <th>Return Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td>{{ request.title }}</td>
          <td>{{ request.author }}</td>
          <td>{{ request.requested_by }}</td>
          <td>{{ new Date(request.return_date).toLocaleDateString() }}</td>
          <td>{{ request.status }}</td>
          <td>
            <button v-if="request.status === 'Pending'" @click="acceptRequest(request.id)">Accept</button>
            <button v-if="request.status === 'Pending'" @click="rejectRequest(request.id)">Reject</button>
            <button v-if="request.status === 'Accepted'" @click="revokeAccess(request.id)">Revoke</button>
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
      requests: [],
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
      const response = await fetch('http://127.0.0.1:5000/requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 403) {
        this.$router.push('/login');
        return;
      }
      if (response.ok) {
        this.requests = await response.json();
      } else {
        this.message = 'Failed to load requests.';
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      this.message = 'An error occurred while fetching requests.';
    }
  },
  methods: {
    async exportData() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch('http://127.0.0.1:5000/export-csv', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'library_data.csv';
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          this.message = 'Failed to export data.';
        }
      } catch (error) {
        console.error('Error exporting data:', error);
        this.message = 'An error occurred while exporting data.';
      }
    },
    async acceptRequest(requestId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${requestId}/accept`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          this.message = 'Request accepted successfully.';
          this.requests = this.requests.map(request => 
            request.id === requestId ? { ...request, status: 'Accepted', is_granted: true } : request
          );
        } else {
          this.message = 'Failed to accept request.';
        }
      } catch (error) {
        console.error('Error accepting request:', error);
        this.message = 'An error occurred while accepting the request.';
      }
    },
    async rejectRequest(requestId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${requestId}/reject`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          this.message = 'Request rejected successfully.';
          this.requests = this.requests.map(request => 
            request.id === requestId ? { ...request, status: 'Rejected', is_requested: false, requested_by: null, return_date: null } : request
          );
        } else {
          this.message = 'Failed to reject request.';
        }
      } catch (error) {
        console.error('Error rejecting request:', error);
        this.message = 'An error occurred while rejecting the request.';
      }
    },
    async revokeAccess(requestId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${requestId}/revoke`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          this.message = 'Access revoked successfully.';
          this.requests = this.requests.map(request => 
            request.id === requestId ? { ...request, status: 'Revoked', is_granted: false, is_requested: false, requested_by: null, return_date: null } : request
          );
        } else {
          this.message = 'Failed to revoke access.';
        }
      } catch (error) {
        console.error('Error revoking access:', error);
        this.message = 'An error occurred while revoking access.';
      }
    }
  }
};
</script>

<style scoped>


ul {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
}

ul li a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  transition: background-color 0.3s;
}

ul li a:hover {
  background-color: #34495E;
}

.requests {
  padding: 20px;
  background: #FAFAFA;
  border-radius: 5px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-top: 20px;
}

thead {
  background-color: #ECECEC;
}

th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #DDD;
}

th {
  font-weight: bold;
}

button {
  background-color: #0a0058;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-right: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #45A049;
}

.btn-danger {
  background-color: #E53935;
}

.btn-danger:hover {
  background-color: #D32F2F;
}

.error-message, .message {
  color: #d9534f;
  padding: 10px;
  margin-top: 5px;
}
</style>
