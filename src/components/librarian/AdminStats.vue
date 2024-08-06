<template>
    <div class="admin-stats">
      <h1>Statistics</h1>
      <div class="stats">
        <p>Active Users: {{ activeUsers }}</p>
        <p>Total Sections: {{ totalSections }}</p>
        <p>Total E-Books: {{ totalEbooks }}</p>
        <p>Total Books Requested: {{ totalRequested }}</p>
        <p>Total Books Approved: {{ totalApproved }}</p>
        <p>Total Books Rejected: {{ totalRejected }}</p>
        <p>Total Books Revoked: {{ totalRevoked }}</p>
      </div>
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
