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
        </tr>
    </thead>
    <tbody>
        <tr v-for="book in books" :key="book.id">
        <td>{{ book.title }}</td>
        <td>{{ book.author }}</td>
        <td>{{ new Date(book.date_requested).toLocaleDateString() }}</td>
        <td>{{ book.return_date ? new Date(book.return_date).toLocaleDateString() : 'N/A' }}</td>
        <td>{{ book.status }}</td>
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
}
};
</script>

<style>
/* Add your styles here */
</style>
