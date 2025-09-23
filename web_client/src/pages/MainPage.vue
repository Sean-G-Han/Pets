<script setup lang="ts">
import MainMenuUI from '.././MainMenuUI.vue'
import PetRenderer from '.././PetRenderer.vue'
import type { Pet } from '.././types/pets'
import '../style.css'
import { ref } from 'vue'

const displayPet = ref<Pet | null>(null)

const handlePetClick = (pet: Pet) => {
  displayPet.value = pet
}
</script>
<template>
  <div class="main">
    <PetRenderer v-if="displayPet" v-bind="displayPet" mode="card" />
    <MainMenuUI @pet-click="handlePetClick" />
  </div>
</template>

<style scoped></style>
