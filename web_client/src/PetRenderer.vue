<script setup lang="ts">
import { defineProps } from 'vue'
import type { Pet } from './types/pets'
import { PetAnimation } from './types/petAnimation'

type RenderMode = 'circle' | 'large'

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
    class="tooltip"
    :class="{
      'large-border': props.mode === 'large',
      'circle-border': props.mode === 'circle',
    }"
    @click="clicked"
  >
    <img :src="PetAnimation.getSprite(props)" :alt="props.species_name" />
    <div class="tooltip-text">
      {{ props.species_name }}
    </div>
  </div>
</template>

<style scoped>
.large-border {
  height: 300px;
  width: 300px;
  padding: 15px;
  display: inline-block;
  position: relative;
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
.large-border img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border-radius: inherit; /* inherit border radius from wrapper */
}

.tooltip .tooltip-text {
  visibility: hidden;
  opacity: 0;
  width: max-content;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;

  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  transition: opacity 0.2s;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
