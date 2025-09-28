<script setup lang="ts">
import MainMenuUI from '../components/MainMenuUI.vue'
import PetRenderer from '../components/PetRenderer.vue'
import type { Pet } from '../types/pets'
import { ref } from 'vue'
import '../style.css'
import { usePetsStore } from '../stores/petsStore'

const displayPet = ref<Pet[]>([])
const loading = ref(false)

const handlePetClick = (pet: Pet) => {
  if (displayPet.value.length < 2) {
    displayPet.value.push(pet)
    return
  } else {
    displayPet.value.shift()
    displayPet.value.push(pet)
    return
  }
}
async function replicatePets() {
  if (displayPet.value.length === 2) {
    const pet_id1 = displayPet.value[0].id
    const pet_id2 = displayPet.value[1].id
    try {
      loading.value = true
      const res = await fetch(`${import.meta.env.VITE_API_URL}/breed-pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pet_id1: pet_id1, pet_id2: pet_id2 }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || data.message || `HTTP ${res.status}`
        throw new Error(errorMsg)
      }
      console.log('Replication successful:', data.child)
      usePetsStore().addPet(data.child)
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Login error: ' + err.message)
      }
    } finally {
      loading.value = false
    }
  }
}
</script>
<template>
  <div class="main center-div">
    <div class="center-div">
      <div class="replication-display">
        <PetRenderer v-for="pet in displayPet" :key="pet.id" v-bind="pet" mode="large" />
      </div>
      <div class="replication-controls">
        <button class="replication-btn vt323-regular" @click="displayPet = []">Reset</button>
        <button
          :disabled="displayPet.length < 2 || loading"
          class="replication-btn vt323-regular"
          @click="replicatePets"
        >
          {{ loading ? 'Replicating...' : 'Replicate' }}
        </button>
      </div>
    </div>
    <MainMenuUI @pet-click="handlePetClick" />
  </div>
</template>

<style scoped>
.replication-btn {
  display: block;
  width: 220px;
  background-color: #0055ff;
  border: #ffffff 4px solid;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 8px 16px;
  margin: 10px;
}
.replication-btn:disabled {
  background-color: grey;
  border: #ffffff 4px solid;
  color: white;
  cursor: not-allowed;
}
.replication-display {
  display: flex;
  gap: 50px;
}
</style>
