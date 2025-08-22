<script setup lang="ts">
const props = defineProps<{
  label: string;
  type: string;
  placeholder: string;
  modelValue: string;
  error?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">{{
      props.label
    }}</label>
    <div class="relative">
      <input
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        @input="handleInput"
        class="w-full pr-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        :class="{ 'border-red-500': props.error }"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="append"></slot>
      </div>
    </div>
    <p v-if="props.error" class="text-red-500 text-xs mt-1">
      {{ props.error }}
    </p>
  </div>
</template>
