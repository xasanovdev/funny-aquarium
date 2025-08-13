<template>
  <div
    class="w-full border border-blue-400 bg-blue-100 relative rounded-md bg-grid"
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
