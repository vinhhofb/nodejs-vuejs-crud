<template>
<div class="container">
    <div class="form-container">
        <h2>Add New Book</h2>
        <div>
            <label for="title">Title:</label>
            <input type="text" v-model="formData.title" id="title" name="title" required><br>
            <label for="author">Author:</label>
            <input type="text" v-model="formData.author" id="author" name="author" required><br>
            <button class="btn" @click="handleForm">{{ editingIndex != null ? "Edit" : "Add" }}</button>
        </div>
    </div>
    <div class="table-container">
        <h2>Books</h2>
        <table id="bookTable">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in books" :key="index">
                    <td>{{ book.title }}</td>
                    <td>{{ book.author }}</td>
                    <td>
                        <button class="btn" @click="editRecord(index)">Edit</button>
                        <button class="btn" @click="deleteRecord(index)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            editingIndex: null,
            books: [],
            formData: {
                title: '',
                author: ''
            }
        };
    },
    mounted() {
        this.fetchBooks();
    },
    methods: {
        handleForm() {
            if (this.editingIndex != null) {
                this.updateRecord()
            } else {
                this.addBook();
            }
        },
        editRecord(index) {
            this.editingIndex = index;
            this.formData = {
                ...this.books[index]
            };
        },
        async fetchBooks() {
            try {
                const response = await fetch('http://localhost:3000/books/');
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                this.books = data;
            } catch (error) {
                console.error(error);
            }
        },
        async addBook() {
            try {
                const response = await fetch('http://localhost:3000/books/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.formData)
                });
                if (!response.ok) {
                    throw new Error('Failed to add book');
                }
                this.formData.title = '';
                this.formData.author = '';
                this.fetchBooks();
            } catch (error) {
                console.error(error);
            }
        },
        async updateRecord() {
            try {
                const response = await fetch(`http://localhost:3000/books/${this.books[this.editingIndex].id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.formData)
                });
                if (!response.ok) {
                    throw new Error('Failed to update book');
                }
                this.formData.title = '';
                this.formData.author = '';
                this.editingIndex = null;
                this.fetchBooks();
            } catch (error) {
                console.error(error);
            }
        },
        async deleteRecord(index) {
            try {
                const bookId = this.books[index].id;
                const response = await fetch(`http://localhost:3000/books/${bookId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Failed to delete book');
                }
                this.fetchBooks();
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f2f2f2;
}

.container {
    display: flex;
    width: 80%;
    margin: auto;
}

.form-container {
    width: 300px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table-container {
    margin-left: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
}

input[type="text"],
input[type="submit"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
}

input[type="submit"] {
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
}

input[type="submit"]:hover {
    background-color: #0056b3;
}
.btn {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .edit-btn {
    background-color: #008CBA;
  }

  .delete-btn {
    background-color: #f44336;
  }
</style>
