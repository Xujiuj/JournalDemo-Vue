<template>
  <div class="relative inline-flex" ref="searchWrapper">
    <div 
      class="search-box-wrapper gradient-border"
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
.search-box-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;
  height: 40px;
  padding: 0 16px 0 20px;
  gap: 12px;
  background: white;
  border-radius: 20px;
  border: none !important;
  outline: none !important;
  transition: transform var(--transition-fast);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: text;
  /* 确保没有任何边框显示 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.dark .search-box-wrapper {
  background: rgb(30, 41, 59);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.search-box-wrapper:focus,
.search-box-wrapper:focus-visible,
.search-box-wrapper:focus-within {
  border: none !important;
  outline: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.search-box-wrapper.is-focused {
  transform: scale(1.05);
}

/* 彩虹流光轮廓 - 外层边框层 */
.search-box-wrapper.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: 0;
  border-radius: 21px; /* 比容器大1px，匹配inset -1px */
  background: linear-gradient(
    90deg,
    #ff0080 0%,
    #ff8000 14.28%,
    #ffff00 28.56%,
    #80ff00 42.84%,
    #00ff80 57.12%,
    #00ffff 71.4%,
    #0080ff 85.68%,
    #8000ff 100%,
    #ff0080 100%
  );
  background-size: 400% 100%;
  animation: rainbowFlow 3s linear infinite;
  opacity: 0.5;
  filter: brightness(0.8);
  transition: opacity var(--transition-normal), filter var(--transition-normal);
  will-change: background-position;
}

.search-box-wrapper.gradient-border.is-focused::before {
  opacity: 1;
  filter: brightness(1.3);
}

/* 流光动画 - 持续循环流动 */
@keyframes rainbowFlow {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 400% 0;
  }
}

/* 背景遮盖层 - 遮盖中间部分，只留下边框 */
.search-box-wrapper.gradient-border::after {
  content: '';
  position: absolute;
  inset: 1px;
  background: white;
  border-radius: 19px; /* 比容器小1px，形成1px的边框 */
  z-index: 1;
  pointer-events: none;
}

.dark .search-box-wrapper.gradient-border::after {
  background: rgb(30, 41, 59);
}

/* 输入框和按钮在上层，确保在遮盖层之上 */
.search-box-wrapper.gradient-border > * {
  position: relative;
  z-index: 20;
}

.search-input {
  flex: 1;
  border: none !important;
  outline: none !important;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: rgb(15, 23, 42);
  height: 100%;
  padding: 0;
  /* 移除所有可能的边框和轮廓 */
  box-shadow: none !important;
}

.search-input:focus,
.search-input:focus-visible,
.search-input:focus-within {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.dark .search-input {
  color: rgb(226, 232, 240);
}

.search-input::placeholder {
  color: rgb(148, 163, 184);
}

.dark .search-input::placeholder {
  color: rgb(100, 116, 139);
}

.search-button {
  flex-shrink: 0;
  border: none;
  outline: none;
  background: transparent;
  color: rgb(6, 182, 212);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity var(--transition-fast);
  padding: 0;
}

.search-button:hover:not(:disabled) {
  opacity: 0.7;
}

.search-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.dark .search-button {
  color: rgb(34, 211, 238);
}

@media (max-width: 768px) {
  .search-box-wrapper {
    width: 240px;
    padding: 0 12px 0 16px;
  }
}
.search-box__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: rgba(255, 255, 255, 0.98);
  outline: none;
  font-size: 0.9rem;
  color: #0f172a;
  padding: 0.625rem 1.25rem;
  border-radius: 999px;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.3s ease;
  pointer-events: none;
}

.search-box__input:focus {
  border-color: rgba(14, 165, 233, 0.7);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.search-box__input::placeholder {
  color: #94a3b8;
}

/* 深色模式 */
.dark .search-box {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(14, 165, 233, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark .search-box:hover {
  border-color: rgba(14, 165, 233, 0.6);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(14, 165, 233, 0.2);
}

.dark .search-box__text {
  color: #94a3b8;
}

.dark .search-box:hover .search-box__text:not(.hidden) {
  color: #38bdf8;
}

.dark .search-box__icon {
  color: #94a3b8;
}

.dark .search-box:hover .search-box__icon {
  color: #38bdf8;
}

.dark .search-box__input {
  background: rgba(15, 23, 42, 0.98);
  color: #e2e8f0;
}

.dark .search-box__input::placeholder {
  color: #64748b;
}

/* 输入框激活状态 */
.search-box__input.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
  padding-right: 2.5rem; /* 为图标留出空间 */
}

/* 响应式 */
@media (max-width: 768px) {
  .search-box {
    min-width: 160px;
    padding: 0.5rem 1rem;
  }
}
</style>
