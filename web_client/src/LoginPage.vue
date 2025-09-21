<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref<'login' | 'register'>('login')

const email = ref('')
const password = ref('')
const username = ref('')
const loading = ref(false)

const confirmPassword = ref('')

async function login() {
  try {
    loading.value = true
    const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMsg = data.error || data.message || `HTTP ${res.status}`
      throw new Error(errorMsg)
    }

    router.push('/main')
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert('Login error: ' + err.message)
    }
  } finally {
    loading.value = false
  }
}

async function register() {
  try {
    if (password.value !== confirmPassword.value) {
      throw new Error("Passwords don't match")
    }

    loading.value = true
    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        display_name: username.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMsg = data.error || data.message || `HTTP ${res.status}`
      throw new Error(errorMsg)
    }

    router.push('/main')
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert('Register error: ' + err.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="tabs">
        <button :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
          Login
        </button>
        <button :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">
          Register
        </button>
      </div>

      <div v-if="activeTab === 'login'" class="form">
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="login" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>

      <div v-else class="form">
        <input v-model="username" placeholder="Username" />
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
        <button @click="register" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 95vh;
  padding: 0;
  margin: 0;
}

.card {
  background-color: grey;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 400px;
  width: 100%;
  border-radius: 8px;
}

.tabs {
  display: flex;
  margin-bottom: 16px;
}

.tabs button {
  flex: 1;
  color: white;
  padding: 10px;
  border: none;
  background-color: grey;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  font-weight: bold;
  transition: background-color 0.2s;
}

.tabs button:hover {
  background-color: #d0d0d0;
}

.tabs button.active {
  background-color: #007bff;
}

.form {
  display: flex;
  flex-direction: column;
}

.form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form button:hover {
  background-color: #0056b3;
}

@media (max-height: 500px) {
  .card-wrapper {
    align-items: flex-start;
    overflow-y: auto;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
