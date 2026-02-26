<script setup>
import { ref } from "vue";
import axios from "axios";

const userData = ref([]);
const loading = ref(false);
const error = ref("");
const limit = ref(4);

// form state
const newUser = ref({
  name: "",
  age: ""
});

// axios base URL (bisa ganti pakai import.meta.env.VITE_API_URL)
const api = axios.create({
  baseURL: "http://127.0.0.1:3000"
});

// ====================
// GET USERS
// ====================
const getUserData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await api.get(`/users?limit=${limit.value}`);
    userData.value = res.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
};

// ====================
// ADD USER
// ====================
const addUserData = async () => {
  if (!newUser.value.name || !newUser.value.age) {
    error.value = "Name dan Age wajib diisi";
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    const res = await api.post("/users", {
      name: newUser.value.name,
      age: Number(newUser.value.age)
    });

    // Tambahkan user baru ke list tanpa fetch ulang
    userData.value.push(res.data);

    // reset form
    newUser.value.name = "";
    newUser.value.age = "";

  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <h2>Users</h2>

    <!-- Fetch Button -->
    <button @click="getUserData">Fetch Users</button>

    <!-- Limit Input -->
    <div>
      <label>Limit: </label>
      <input type="number" v-model="limit" min="1" />
    </div>

    <hr />

    <!-- Add User Form -->
    <h3>Tambah User</h3>
    <input
      v-model="newUser.name"
      placeholder="Nama"
    />
    <input
      v-model="newUser.age"
      type="number"
      placeholder="Umur"
    />
    <button @click="addUserData">Tambah</button>

    <hr />

    <!-- Loading -->
    <p v-if="loading">Loading...</p>

    <!-- Error -->
    <p v-else-if="error" style="color:red">
      {{ error }}
    </p>

    <!-- List User -->
    <div v-else>
      <div v-for="user in userData" :key="user.id">
        {{ user.name }} - {{ user.age }}
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

input {
  margin: 5px;
  padding: 5px;
}

button {
  margin: 5px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>