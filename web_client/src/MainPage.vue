<script setup lang="ts">
import MainMenu from './MainMenu.vue'
import NumberMeter from './NumberMeter.vue'
import PetRenderer from './PetRenderer.vue'
import type { Pet } from './types/pets'
import { ref } from 'vue'

const displayPet = ref<Pet | null>(null)

const handlePetClick = (pet: Pet) => {
  displayPet.value = pet
}
</script>
<template>
  <div class="wrapper">
    <div class="content">
      <PetRenderer v-if="displayPet" v-bind="displayPet" mode="large" />
      <div v-if="displayPet" class="pet-info">
        <NumberMeter label="Attack" :value="displayPet.atk" :threshold="50" />
        <NumberMeter label="Defense" :value="displayPet.def" :threshold="50" />
        <NumberMeter label="Speed" :value="displayPet.spd" :threshold="50" />
        <NumberMeter label="Health" :value="displayPet.hp" :threshold="50" />
      </div>
    </div>
    <MainMenu @pet-click="handlePetClick" />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  background-color: #282c34;
}
.content {
  color: #ffffff;
  flex: 1;
  text-align: center;
}
</style>
