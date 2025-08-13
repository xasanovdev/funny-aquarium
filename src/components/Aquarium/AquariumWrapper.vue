<template>
  <div
    class="ring-4 ring-blue-700 w-full relative overflow-hidden rounded-md bg-grid"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  width: number
  height: number
}

defineProps<Props>()
</script>
