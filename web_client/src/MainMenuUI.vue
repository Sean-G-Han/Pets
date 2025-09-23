<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PetRenderer from './PetRenderer.vue'
import { usePetsStore } from '@/stores/petsStore'
import type { Pet } from './types/pets'
import router from './router'

const petsStore = usePetsStore()
const isOpen = ref(true)

const emit = defineEmits<{
  (e: 'pet-click', pet: Pet): void
}>()

const handlePetClick = (pet: Pet) => {
  isOpen.value = false
  emit('pet-click', pet)
}

async function loadPets() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/my-pets`, {
    credentials: 'include',
  })

  if (!res.ok) {
    console.error('Failed to load pets')
    return
  }

  const data = await res.json()
  petsStore.setPets(data.pets)
}

onMounted(loadPets)
</script>

<template>
  <div>
    <div class="button-row">
      <button class="toggle-btn vt323-regular" @click="isOpen = !isOpen">
        {{ isOpen ? 'Hide Menu' : 'Show Menu' }}
      </button>

      <button class="toggle-btn vt323-regular" @click="router.push('/main')">Go to Main</button>

      <button class="toggle-btn vt323-regular" @click="router.push('/replication')">
        Go to Replication
      </button>
    </div>

    <div class="menu-wrapper" :class="{ open: isOpen }">
      <h1 style="text-align: center" class="vt323-regular">My Pets</h1>
      <div class="menu">
        <PetRenderer
          v-for="pet in petsStore.getPets"
          :key="pet.id"
          v-bind="pet"
          mode="circle"
          @click="handlePetClick(pet)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  max-width: 90vw;

  background-color: #333;
  color: white;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  width: 500px;

  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.menu-wrapper.open {
  transform: translateX(0);
}

.button-row {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  position: fixed;
  bottom: 20px;
  gap: 8px;
  right: 20px;
  z-index: 1001;
}

.toggle-btn {
  display: block;
  background: #444;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
}

.toggle-btn:hover {
  background: #555;
}

.menu {
  flex: 0 0 auto;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
}
</style>
