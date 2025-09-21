<script setup lang="ts">
import { defineProps, computed } from 'vue'

type Props = {
  label: string
  value: number // assume between 0–100 for percentage, can be adapted
  threshold: number
}

const props = defineProps<Props>()

const barWidth = computed(() => `${Math.min(props.value * 2, 100)}%`)

const barColor = computed(() => {
  const ratio = Math.min(props.value / props.threshold, 1)

  const r = Math.round(255 * (1 - ratio))
  const g = Math.round(128 * ratio)
  const b = 0

  return `rgb(${r}, ${g}, ${b})`
})
</script>

<template>
  <div class="meter-wrapper">
    <div class="label">{{ props.label }}</div>
    <div class="number-meter">
      <div class="number-meter-inner" :style="{ width: barWidth, backgroundColor: barColor }">
        {{ props.value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.meter-wrapper {
  margin: 8px 0;
}

.label {
  font-size: 24px;
  width: 100px;
  margin-bottom: 4px;
  text-align: left;
  display: inline-block;
}

.number-meter {
  display: inline-block;
  width: 200px;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.number-meter-inner {
  height: 100%;
  transition: width 0.3s ease;
}
</style>
