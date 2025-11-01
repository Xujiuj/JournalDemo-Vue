<template>
  <div class="relative inline-flex" ref="searchWrapper">
    <div 
      class="search-box-wrapper"
      :class="{ 'is-focused': isFocused }"
      @click="handleClick"
    >
      <input
        ref="searchInput"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keyup.enter="performSearch"
        type="text"
        class="search-input"
        :placeholder="placeholder"
      />
      
      <button
        @click.stop="performSearch"
        :disabled="!modelValue?.trim()"
        class="search-button"
        type="button"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search Articles...'
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const searchInput = ref(null)
const searchWrapper = ref(null)
const isFocused = ref(false)

const handleClick = () => {
  searchInput.value?.focus()
}

const handleBlur = () => {
  setTimeout(() => {
    if (!searchWrapper.value?.contains(document.activeElement)) {
      isFocused.value = false
    }
  }, 200)
}

const performSearch = () => {
  if (props.modelValue?.trim()) {
    emit('search')
  }
}

const handleClickOutside = (event) => {
  if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
    isFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 组件样式导入 */
@import '@/assets/styles/components/search-box.css';
</style>
