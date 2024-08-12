<template>
  <nav class="navbar">
    <div class="navbar-left">IITM Central Librarian Portal 📕 😅</div>
      <ul>
        <li><router-link to="/admindashboard">Admin Dashboard</router-link></li>
        <li><router-link to="/requests">User Requests</router-link></li>
        <li><router-link to="/">Logout</router-link></li>
      </ul>
    </nav>
    <div class="admin-stats">
      <h1>Statistics</h1>
      <div class="stats-grid">
      <div class="stat-box">
        <p>Active Users</p>
        <span>{{ activeUsers }}</span>
      </div>
      <div class="stat-box">
        <p>Total Sections</p>
        <span>{{ totalSections }}</span>
      </div>
      <div class="stat-box">
        <p>Total E-Books</p>
        <span>{{ totalEbooks }}</span>
      </div>
      <div class="stat-box">
        <p>Total Books Requested</p>
        <span>{{ totalRequested }}</span>
      </div>
      <div class="stat-box">
        <p>Total Books Approved</p>
        <span>{{ totalApproved }}</span>
      </div>
      <div class="stat-box">
        <p>Total Books Rejected</p>
        <span>{{ totalRejected }}</span>
      </div>
      <div class="stat-box">
        <p>Total Books Revoked</p>
        <span>{{ totalRevoked }}</span>
      </div>
    </div>
    <h2>Statistics Charts</h2>
      <div class="chart-container">
        <canvas id="barChart"></canvas>
        <canvas id="pieChart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    data() {
      return {
        activeUsers: 0,
        totalSections: 0,
        totalEbooks: 0,
        totalRequested: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalRevoked: 0,
        sections: [],
      };
    },
    async created() {
      const token = localStorage.getItem('token');
      await this.fetchDashboardData(token);
      await this.fetchSections(token);
      await this.fetchRequestStatistics(token);
      this.renderBarChart();
      this.renderPieChart();
    },
    methods: {
      async fetchDashboardData(token) {
        try {
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
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      },
      async fetchSections(token) {
        try {
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
        } catch (error) {
          console.error('Error fetching sections data:', error);
        }
      },
      async fetchRequestStatistics(token) {
        try {
          const requestsResponse = await fetch('http://127.0.0.1:5000/requests/statistics', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (requestsResponse.status === 401) {
            this.$router.push('/login');
            return;
          }
          const requestData = await requestsResponse.json();
          this.totalRequested = requestData.total_requested;
          this.totalApproved = requestData.total_approved;
          this.totalRejected = requestData.total_rejected;
          this.totalRevoked = requestData.total_revoked;
        } catch (error) {
          console.error('Error fetching request statistics:', error);
        }
      },
      renderBarChart() {
        const ctx = document.getElementById('barChart').getContext('2d');
        if (this.barChart) {
          this.barChart.destroy();
        }
        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Approved', 'Rejected', 'Revoked'],
            datasets: [{
              label: 'Requests',
              data: [this.totalApproved, this.totalRejected, this.totalRevoked],
              backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      },
      renderPieChart() {
        const ctx = document.getElementById('pieChart').getContext('2d');
        if (this.pieChart) {
          this.pieChart.destroy();
        }
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.sections.map(section => section.name),
            datasets: [{
              data: this.sections.map(section => section.ebooks.length),
              backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      },
    },
    watch: {
      sections() {
        this.renderPieChart();
      },
      totalApproved() {
        this.renderBarChart();
      },
      totalRejected() {
        this.renderBarChart();
      },
      totalRevoked() {
        this.renderBarChart();
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-stats {
    padding: 20px;
  }
  
  .stats p {
    font-size: 1.1rem;
  }
  
  .stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-bottom: 20px;
}

.stat-box {
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.stat-box p {
  font-size: 1.2rem;
  margin: 0;
}

.stat-box span {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 10px;
  color: #333;
}

.chart-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

canvas {
  max-width: 400px;
  margin: 20px;
}
  </style>
