<template>
<div class="requests">
    <h2>User Requests</h2>
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
        <tr v-for="request in requests" :key="request.ebook_id">
        <td>{{ request.title }}</td>
        <td>{{ request.author }}</td>
        <td>{{ request.requested_by }}</td>
        <td>{{ new Date(request.return_date).toLocaleDateString() }}</td>
        <td>{{ request.status }}</td>
        <td>
            <button @click="acceptRequest(request.ebook_id)" :disabled="request.status !== 'Pending'">Accept</button>
            <button @click="rejectRequest(request.ebook_id)" :disabled="request.status !== 'Pending'">Reject</button>
            <button v-if="request.status === 'Accepted'" @click="revokeAccess(request.ebook_id)">Revoke</button>
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
    async acceptRequest(ebook_id) {
    const token = localStorage.getItem('token');
    if (!token) {
        this.$router.push('/login');
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${ebook_id}/accept`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        if (response.ok) {
        this.message = 'Request accepted successfully.';
        this.requests = this.requests.map(request => 
            request.ebook_id === ebook_id ? { ...request, status: 'Accepted', is_granted: true } : request
        );
        } else {
        this.message = 'Failed to accept request.';
        }
    } catch (error) {
        console.error('Error accepting request:', error);
        this.message = 'An error occurred while accepting the request.';
    }
    },
    async rejectRequest(ebook_id) {
    const token = localStorage.getItem('token');
    if (!token) {
        this.$router.push('/login');
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${ebook_id}/reject`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        if (response.ok) {
        this.message = 'Request rejected successfully.';
        this.requests = this.requests.map(request => 
            request.ebook_id === ebook_id ? { ...request, status: 'Rejected', is_requested: false, requested_by: null, return_date: null } : request
        );
        } else {
        this.message = 'Failed to reject request.';
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
        this.message = 'An error occurred while rejecting the request.';
    }
    },
    async revokeAccess(ebook_id) {
    const token = localStorage.getItem('token');
    if (!token) {
        this.$router.push('/login');
        return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${ebook_id}/revoke`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        if (response.ok) {
        this.message = 'Access revoked successfully.';
        this.requests = this.requests.map(request => 
            request.ebook_id === ebook_id ? { ...request, status: 'Revoked', is_granted: false, is_requested: false, requested_by: null, return_date: null } : request
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

<style>
/* Add your styles here */
</style>
