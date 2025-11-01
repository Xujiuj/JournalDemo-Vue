<template>
  <div id="app">
    <Header />
    <main>
      <router-view v-slot="{ Component, route }">
        <transition
          name="slide-transition"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @after-enter="onAfterEnter"
          @leave="onLeave"
          @after-leave="onAfterLeave"
          @enter-cancelled="onEnterCancelled"
          @leave-cancelled="onLeaveCancelled"
          :css="false"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSysInfoStore } from './stores';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { scrollToTop, onScroll } from './utils/scroll.js';
import { isForward } from './utils/routeOrder.js';
import {
  routeTransition,
  shouldUseFade,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onLeave,
  onAfterLeave,
  onEnterCancelled,
  onLeaveCancelled,
} from './utils/animations';

const router = useRouter();
const sysInfoStore = useSysInfoStore();

const showBackToTop = ref(false);

// 滚动监听
let removeScrollListener = null;

const handleScroll = (position) => {
  // 当滚动超过300px时显示回到顶部按钮
  showBackToTop.value = position.y > 300;
};

onMounted(() => {
  // 开始监听滚动事件
  removeScrollListener = onScroll(handleScroll);

  // 监听路由变化，在导航之前设置动画状态
  router.beforeEach((to, from, next) => {
    // 只在有from路由时设置动画状态（避免首次加载时出错）
    if (from && from.path) {
      routeTransition.useFade = shouldUseFade(from, to);
      if (!routeTransition.useFade) {
        routeTransition.isForward = isForward(from, to, sysInfoStore);
      }
    }
    next(); // 确保不阻塞导航
  });
});

onUnmounted(() => {
  // 清理滚动监听
  if (removeScrollListener) {
    removeScrollListener();
  }
  // 清理 GSAP 动画
  if (routeTransition.enterTween) {
    routeTransition.enterTween.kill();
  }
  if (routeTransition.leaveTween) {
    routeTransition.leaveTween.kill();
  }
});
</script>

<style>
/* 基础样式和工具类 */
@import './assets/styles/index.css';
/* App组件需要的样式 */
@import './assets/styles/components/app-transitions.css';
</style>

