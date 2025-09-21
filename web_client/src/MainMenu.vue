<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PetRenderer from './PetRenderer.vue'
import { usePetsStore } from '@/stores/petsStore'
import type { Pet } from './types/pets'

const petsStore = usePetsStore()
const isOpen = ref(true)

const emit = defineEmits<{
  (e: 'pet-click', pet: Pet): void
}>()

const handlePetClick = (pet: Pet) => {
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
    <button class="toggle-btn" @click="isOpen = !isOpen">
      {{ isOpen ? 'Hide Menu' : 'Show Menu' }}
    </button>

    <div class="menu-wrapper" :class="{ open: isOpen }">
      <h1 style="text-align: center">My Pets</h1>
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

.toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;

  background: #444;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
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
