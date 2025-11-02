<template>
  <div id="app">
    <Header />
    <main class="transition-container">
      <router-view v-slot="{ Component, route }">
        <transition
          :name="transitionName"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <Footer />
    
    <!-- 回到顶部按钮 -->
    <button 
      v-show="showBackToTop" 
      @click="scrollToTop"
      class="back-to-top"
      :class="{ 'show': showBackToTop }"
      title="回到顶部"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSysInfoStore } from './stores';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { scrollToTop, onScroll } from './utils/scroll.js';
import { isForward } from './utils/routeOrder.js';

const router = useRouter();
const sysInfoStore = useSysInfoStore();

const showBackToTop = ref(false);
const transitionName = ref('slide-forward');

// 滚动监听
let removeScrollListener = null;

const handleScroll = (position) => {
  // 当滚动超过300px时显示回到顶部按钮
  showBackToTop.value = position.y > 300;
};

onMounted(() => {
  // 开始监听滚动事件
  removeScrollListener = onScroll(handleScroll);
  
  // 监听路由变化，动态设置过渡动画
  router.beforeEach((to, from, next) => {
    if (from.name && to.name) {
      const forward = isForward(from, to, sysInfoStore);
      transitionName.value = forward ? 'slide-forward' : 'slide-back';
    }
    next();
  });
});

onUnmounted(() => {
  // 清理滚动监听
  if (removeScrollListener) {
    removeScrollListener();
  }
});
</script>

<style scoped>
/* App.vue 专用样式 - 使用scoped避免全局污染 */
.transition-container {
  position: relative;
  width: 100%;
}
</style>

<style>
/* 全局样式导入 */
@import './assets/styles/index.css';
@import './assets/styles/components/app-transitions.css';
@import './assets/styles/components/forms.css';

/* App布局相关的全局样式 - 最小化影响 */
#app main {
  flex: 1;
}

#app main router-view {
  display: block;
}
</style>

