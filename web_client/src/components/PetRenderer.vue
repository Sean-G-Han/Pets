<script setup lang="ts">
import { defineProps } from 'vue'
import type { Pet } from '@/types/pets'
import { PetAnimation } from '@/types/petAnimation'

type RenderMode = 'circle' | 'medium' | 'large'

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
      'medium-border': props.mode === 'medium',
      'circle-border': props.mode === 'circle',
    }"
    @click="clicked"
  >
    <img :src="PetAnimation.getSprite(props)" :alt="props.species_name" />
  </div>
</template>

<style scoped>
.circle-border {
  border: 6px solid #ffffff;
  background-color: black;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  padding: 15px;
  display: inline-block;
  position: relative;
}
.medium-border {
  height: 100px;
  width: 100px;
  max-width: 20vw;
  display: inline-block;
  position: relative;
}
.large-border {
  height: 200px;
  width: 200px;
  max-width: 30vw;
  display: inline-block;
  position: relative;
}

.circle-border img,
.medium-border img,
.large-border img {
  object-fit: cover;
  width: 100%;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border-radius: inherit;
}
</style>
