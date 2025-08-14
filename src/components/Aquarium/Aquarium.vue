<script setup lang="ts">
import AquariumWrapper from './AquariumWrapper.vue'
import Fishes from './Fishes.vue'

import { onMounted, ref } from 'vue'
import { type IFish } from '../../types/fish'

const AQUARIUM_WIDTH = 1050
const AQUARIUM_HEIGHT = 700
const STEP = 70

const fishes = ref<IFish[]>([])

const statistics = ref({
  total: 0,
  male: 0,
  female: 0,
  alive: 0,
  dead: 0,
  newBorn: 0,
  loved: 0,
})

/**
 * Initializes the aquarium with a random number of fish.
 * Each fish has a random position, gender, lifespan, and size.
 */

const initialization = () => {
  const initCount = Math.random() * 10 + 10

  for (let i = 0; i < initCount; i++) {
    createNewFish('initialFish')
  }
}

const createNewFish = (type: 'newFish' | 'initialFish') => {
  statistics.value.total += 1
  statistics.value.alive += 1

  if (type === 'newFish') {
    statistics.value.newBorn += 1
    statistics.value.loved += 1
  }

  fishes.value.push({
    id: crypto.randomUUID(),
    gender: Math.random() < 0.5 ? 'female' : 'male',
    coords: {
      x: Math.floor(Math.random() * (AQUARIUM_WIDTH / STEP)) * STEP,
      y: Math.floor(Math.random() * (AQUARIUM_HEIGHT / STEP)) * STEP,
    },
    isLoved: false,
    lovedBy: [],
    lifespan: Math.floor(Math.random() * 10) + 10,
    alive: true,
    size: type === 'newFish' ? 0.1 : 1, // New fish are smaller
  })
}

const filterDeadFish = () => {
  return fishes.value.filter((fish) => fish.alive)
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
      if (
        male.coords.x === female.coords.x &&
        male.coords.y === female.coords.y &&
        male.size > 0.8 &&
        female.size > 0.8
      ) {
        // Create a new fish at the same position
        createNewFish('newFish')

        // Mark the male and female fish as loved
        male.isLoved = true
        female.isLoved = true

        // Add the male and female fish IDs to each other's lovedBy arrays
        male.lovedBy.push(female.id)
        female.lovedBy.push(male.id)

        setTimeout(() => {
          male.isLoved = false
          female.isLoved = false

          // Remove the male and female fish IDs from each other's lovedBy arrays
          male.lovedBy = male.lovedBy.filter((id) => id !== female.id)
          female.lovedBy = female.lovedBy.filter((id) => id !== male.id)
        }, 2000)
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
      // If the fish is loved, it will not move
      if (
        fish.isLoved &&
        fish.lovedBy.some((lovedId) => fishes.value.some((f) => f.id === lovedId && f.alive))
      ) {
        return
      }

      // Update position based on random movement
      fish.coords.x += moveOptions[Math.floor(Math.random() * moveOptions.length)]
      fish.coords.y += moveOptions[Math.floor(Math.random() * moveOptions.length)]

      // Keep fish within bounds
      if (fish.coords.x < 0) {
        fish.coords.x = 0
      } else if (fish.coords.x > AQUARIUM_WIDTH - STEP) {
        fish.coords.x = AQUARIUM_WIDTH - STEP
      }

      if (fish.coords.y < 0) {
        fish.coords.y = 0
      } else if (fish.coords.y > AQUARIUM_HEIGHT - STEP) {
        fish.coords.y = AQUARIUM_HEIGHT - STEP
      }

      // Decrease lifespan
      fish.lifespan -= 1

      // Increase size as lifespan decreases
      if (fish.size < 1) {
        fish.size += 0.2 // Increase size gradually
      }

      // If lifespan is over, mark fish as not alive
      if (fish.lifespan <= 0) {
        fish.alive = false
      }
    }
  })
}

onMounted(() => {
  initialization()

  setInterval(() => {
    statistics.value.male = fishes.value.filter((fish) => fish.gender === 'male').length
    statistics.value.female = fishes.value.filter((fish) => fish.gender === 'female').length
    statistics.value.alive = fishes.value.filter((fish) => fish.alive).length

    statistics.value.dead = statistics.value.total - statistics.value.alive

    updateFishes()

    addNewFish()

    fishes.value = filterDeadFish()
  }, 1000) // Clean up every second
})
</script>

<template>
  <div class="flex justify-center gap-5 w-full">
    <!-- Aquarium Statistics -->
    <div class="flex flex-col max-w-sm w-full bg-white p-6 rounded-4xl shadow-md">
      <h2 class="text-xl font-semibold mb-2">Statistika</h2>
      <ul class="list-disc pl-5">
        <li>Total: {{ statistics.total }}</li>
        <li>Male: {{ statistics.male }}</li>
        <li>Female: {{ statistics.female }}</li>
        <li>Dead: {{ statistics.dead }}</li>
        <li>Newborn: {{ statistics.newBorn }}</li>
      </ul>
    </div>

    <!-- Aquarium Content -->
    <div class="">
      <div class="flex items-center justify-center mb-5 bg-white rounded-4xl">
        <img src="/logo.png" alt="Logo" width="120" height="120" />
        <h3 class="text-center font-semibold text-4xl">Aquariumga Xush Kelibsiz !</h3>
      </div>

      <AquariumWrapper :width="AQUARIUM_WIDTH" :height="AQUARIUM_HEIGHT" :statistics="statistics">
        <Fishes :fishes="fishes" :STEP="STEP" />
      </AquariumWrapper>
    </div>
  </div>
</template>

<style scoped>
.bg-grid {
  background-image:
    linear-gradient(to right, rgba(0, 119, 255, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 119, 255, 0.2) 1px, transparent 1px);
  background-size: 70px 70px;
}
</style>
