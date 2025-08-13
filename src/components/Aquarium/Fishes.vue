<template>
  <div
    v-for="item in fishes"
    :key="item.id"
    :class="[
      'absolute transition-all duration-1000 ease-in-out',
      {
        'border border-amber-500 rounded-xl': item.size < 0.8,
      },
    ]"
    :style="{
      left: item.coords.x + STEP / 10 + 'px',
      top: item.coords.y + STEP / 4 + 'px',
      width: item.size * STEP + 'px',
      height: item.size * STEP + 'px',
    }"
  >
    <img :src="`/${item.gender}-fish.png`" class="object-cover" alt="fish" />

    <div class="relative">
      <span class="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold">
        {{ Math.floor(item.lifespan) }}s
      </span>

      <span
        v-if="item.isLoved"
        :class="[
          'absolute transform -translate-x-1/2 text-xs font-bold',
          item.gender === 'male' ? 'left-4 -top-14' : 'right-0 -top-20',
        ]"
      >
        ❤️
      </span>
    </div>
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

<style scoped></style>
