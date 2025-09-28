<script setup lang="ts">
import AppBackground from '@/components/AppBackground.vue'
import MainMenuUI from '@/components/MainMenuUI.vue'
import PetRenderer from '@/components/PetRenderer.vue'
import type { Pet } from '@/types/pets'
import '@/style.css'
import { ref } from 'vue'

const displayPet = ref<Pet | null>(null)

const handlePetClick = (pet: Pet) => {
  displayPet.value = pet
}
</script>
<template>
  <div class="main center-div">
    <AppBackground />
    <PetRenderer v-if="displayPet" v-bind="displayPet" mode="medium" class="bottom" />
    <MainMenuUI @pet-click="handlePetClick" />
  </div>
</template>

<style scoped>
.bottom {
  position: absolute;
  bottom: 70px;
}
</style>
