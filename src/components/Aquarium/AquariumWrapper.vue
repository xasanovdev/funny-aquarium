<template>
  <div
    class="w-full border border-gray-400 relative rounded-md bg-grid"
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
