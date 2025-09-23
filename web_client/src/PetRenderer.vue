<script setup lang="ts">
import { defineProps } from 'vue'
import type { Pet } from './types/pets'
import { PetAnimation } from './types/petAnimation'
import NumberMeter from './NumberMeter.vue'

type RenderMode = 'circle' | 'large' | 'card'

const props = defineProps<Pet & { mode?: RenderMode }>()

const emit = defineEmits<{
  (e: 'pet-click', props: Pet): void
}>()

const clicked = () => {
  emit('pet-click', props)
}
</script>

<template>
  <div
    :class="{
      'large-border': props.mode === 'large',
      'circle-border': props.mode === 'circle',
      'card-border': props.mode === 'card',
    }"
    @click="clicked"
  >
    <img :src="PetAnimation.getSprite(props)" :alt="props.species_name" />

    <div v-if="props.mode === 'card'" class="pet-info">
      id: {{ props.id }} the {{ props.species_name }}
      <NumberMeter label="Attack" :value="props.atk" :threshold="50" />
      <NumberMeter label="Defense" :value="props.def" :threshold="50" />
      <NumberMeter label="Speed" :value="props.spd" :threshold="50" />
      <NumberMeter label="Health" :value="props.hp" :threshold="50" />
    </div>
  </div>
</template>

<style scoped>
.pet-info {
  padding: 5px;
  background-color: black;
  color: white;
  border: #ffffff 2px solid;
  width: fit-content;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card-border {
  background-color: #0055ff;
  border: #ffffff 4px solid;
  display: inline-block;
}

.circle-border {
  border: 6px solid #ffffff;
  background-color: black;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  padding: 15px;
  display: inline-block;
  position: relative;
}

.circle-border img,
.large-border img,
.card-border img {
  object-fit: cover;
  width: 100%;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border-radius: inherit;
}
</style>
