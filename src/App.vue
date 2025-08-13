<script setup lang="ts">
import { onMounted, ref } from 'vue'

const AQUARIUM_WIDTH = 1200
const AQUARIUM_HEIGHT = 800
const STEP = 80

export type Gender = 'male' | 'female'

export interface IFish {
  id: number
  gender: Gender
  x: number
  y: number
  lifespan: number
  alive: boolean
  size: number
}

const fishes = ref<IFish[]>([])

const statistics = ref({
  total: 0,
  male: 0,
  female: 0,
  alive: 0,
  dead: 0,
  averageLifespan: 0,
  averageSize: 0,
})

const updateStatistics = () => {
  const total = fishes.value.length
  const male = fishes.value.filter((fish) => fish.gender === 'male').length
  const female = fishes.value.filter((fish) => fish.gender === 'female').length
  const alive = fishes.value.filter((fish) => fish.alive).length
  const dead = total - alive

  const averageLifespan =
    alive > 0
      ? fishes.value.filter((fish) => fish.alive).reduce((sum, fish) => sum + fish.lifespan, 0) /
        alive
      : 0
  const averageSize =
    alive > 0
      ? fishes.value.filter((fish) => fish.alive).reduce((sum, fish) => sum + fish.size, 0) / alive
      : 0

  statistics.value = {
    total,
    male,
    female,
    alive,
    dead,
    averageLifespan,
    averageSize,
  }
}

/**
 * Initializes the aquarium with a random number of fish.
 * Each fish has a random position, gender, lifespan, and size.
 */

const initialization = () => {
  const initCount = Math.random() * 10 + 10

  for (let i = 0; i < initCount; i++) {
    fishes.value.push({
      id: Math.floor(Math.random() * 10000),
      gender: Math.random() < 0.5 ? 'female' : 'male',
      x: Math.floor(Math.random() * (AQUARIUM_WIDTH / STEP)) * STEP,
      y: Math.floor(Math.random() * (AQUARIUM_HEIGHT / STEP)) * STEP,
      lifespan: Math.random() * 10 + 10,
      alive: true,
      size: 1,
    })
  }
}

/**
 * Add new fish to the aquarium when the male and female fish are equal in position.
 * A new fish is added, it has a random position, gender, lifespan, and size.
 */

const addNewFish = () => {
  const maleFish = fishes.value.filter((fish) => fish.gender === 'male' && fish.alive)
  const femaleFish = fishes.value.filter((fish) => fish.gender === 'female' && fish.alive)

  maleFish.forEach((male) => {
    femaleFish.forEach((female) => {
      if (male.x === female.x && male.y === female.y) {
        // Add a new fish
        fishes.value.push({
          id: Math.floor(Math.random() * 10000),
          gender: Math.random() < 0.5 ? 'female' : 'male',
          x: Math.floor(Math.random() * (AQUARIUM_WIDTH / STEP)) * STEP,
          y: Math.floor(Math.random() * (AQUARIUM_HEIGHT / STEP)) * STEP,
          lifespan: Math.random() * 10 + 10,
          alive: true,
          size: 1,
        })
      }
    })
  })
}

/**
 * Updates the position of each fish based on its lifespan.
 * If a fish's lifespan is over, it is marked as not alive.
 */

const updateFishes = () => {
  const moveOptions = [-STEP, 0, STEP]

  fishes.value.forEach((fish) => {
    if (fish.alive) {
      // Update position based on random movement
      fish.x += moveOptions[Math.floor(Math.random() * moveOptions.length)]
      fish.y += moveOptions[Math.floor(Math.random() * moveOptions.length)]

      // Keep fish within bounds
      if (fish.x < 0) {
        fish.x = 0
      } else if (fish.x > AQUARIUM_WIDTH - STEP) {
        fish.x = AQUARIUM_WIDTH - STEP
      }

      if (fish.y < 0) {
        fish.y = 0
      } else if (fish.y > AQUARIUM_HEIGHT - STEP) {
        fish.y = AQUARIUM_HEIGHT - STEP
      }

      // Decrease lifespan
      fish.lifespan -= 1

      if (fish.lifespan <= 0) {
        fish.alive = false
      }
    }
  })
}

onMounted(() => {
  initialization()

  setInterval(() => {
    addNewFish()

    updateFishes()

    // Remove dead fish
    fishes.value = fishes.value.filter((fish) => fish.alive)

    // Update statistics
    updateStatistics()
  }, 1000) // Clean up every second
})
</script>

<template>
  <section class="mx-auto p-4 flex justify-center flex-col items-center gap-4">
    <div
      class="ring-4 ring-blue-700 w-full relative overflow-hidden rounded-md bg-grid"
      :style="{ width: AQUARIUM_WIDTH + 'px', height: AQUARIUM_HEIGHT + 'px' }"
    >
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
    </div>
  </section>
</template>

<style scoped>
.bg-grid {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 80px 80px;
}
</style>
