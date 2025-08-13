<template>
  <div
    v-for="item in fishes"
    :key="item.id"
    class="absolute transition-all duration-1000 ease-in-out"
    :style="{
      left: item.x + STEP / 10 + 'px',
      top: item.y + STEP / 4 + 'px',
      width: item.size * STEP + 'px',
      height: item.size * STEP + 'px',
    }"
  >
    <img :src="`/${item.gender}-fish.png`" class="object-cover" alt="fish" />
  </div>
</template>

<script setup lang="ts">
import { IFish } from '../../types/fish'

interface Props {
  fishes: IFish[]
  STEP: number
}

defineProps<Props>()
</script>
