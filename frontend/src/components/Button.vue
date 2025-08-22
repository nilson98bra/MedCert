<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();

const emit = defineEmits(["click"]);

const handleClick = () => emit("click");
</script>

<template>
  <button
    @click="handleClick"
    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
  >
    {{ props.label }}
  </button>
</template>
