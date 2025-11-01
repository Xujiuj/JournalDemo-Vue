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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import gsap from 'gsap'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { scrollToTop, onScroll } from './utils/scroll.js'
import { isForward } from './utils/routeOrder.js'

const router = useRouter()
const store = useStore()

const showBackToTop = ref(false)

// 路由过渡方向
let routeTransition = {
  isForward: true,
  enterTween: null,
  leaveTween: null,
  timeline: null,
  leaveElement: null,
  enterElement: null,
  leaveDone: null,
  useFade: false // 是否使用淡入淡出动画（用于article到articleDetail）
}

// 滚动监听
let removeScrollListener = null

const handleScroll = (position) => {
  // 当滚动超过300px时显示回到顶部按钮
  showBackToTop.value = position.y > 300
}

// 进入前准备
const onBeforeEnter = (el) => {
  // 立即设置背景色，确保可见
  const isDark = document.documentElement.classList.contains('dark')
  el.style.backgroundColor = isDark ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)'
  el.style.opacity = '1'
}

// GSAP 进入动画
const onEnter = (el, done) => {
  // 保存进入元素
  routeTransition.enterElement = el
  
  // 获取页面的实际背景色，如果透明则使用默认背景
  const computedStyle = window.getComputedStyle(el)
  const bgColor = computedStyle.backgroundColor
  const isTransparent = bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent'
  const isDark = document.documentElement.classList.contains('dark')
  const bgColorValue = isTransparent ? (isDark ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)') : 'transparent'
  
  // 判断使用淡入还是滑动动画
  if (routeTransition.useFade) {
    // 淡入淡出动画（轻量级，用于article到articleDetail）
    handleFadeEnter(el, done, bgColorValue)
  } else {
    // 滑动动画
    handleSlideEnter(el, done, bgColorValue)
  }
}

// 处理淡入进入动画（轻量级）
const handleFadeEnter = (el, done, bgColor) => {
  // 设置初始状态
  gsap.set(el, {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    opacity: 0,
    backgroundColor: bgColor,
    zIndex: 2
  })

  // 检查是否有离开元素
  if (routeTransition.leaveElement && routeTransition.leaveDone) {
    // 确保旧页面在底层
    gsap.set(routeTransition.leaveElement, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1
    })
    
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(el, { 
          position: 'relative',
          zIndex: 'auto'
        })
        done()
        routeTransition.leaveDone()
        routeTransition.leaveElement = null
        routeTransition.leaveDone = null
        routeTransition.enterElement = null
        routeTransition.timeline = null
      }
    })
    
    // 同时动画：新页面淡入，旧页面淡出
    timeline
      .to(el, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
        force3D: true
      }, 0)
      .to(routeTransition.leaveElement, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
        force3D: true
      }, 0)
    
    routeTransition.timeline = timeline
  } else {
    // 单独动画
    routeTransition.enterTween = gsap.to(el, {
      opacity: 1,
      duration: 0.3,
      ease: 'power1.out',
      force3D: true,
      onComplete: () => {
        gsap.set(el, { 
          position: 'relative',
          zIndex: 'auto'
        })
        done()
      }
    })
  }
}

// 处理滑动进入动画
const handleSlideEnter = (el, done, bgColor) => {
  const isForwardDirection = routeTransition.isForward
  const xFrom = isForwardDirection ? '100%' : '-100%'
  
  // 设置初始状态，确保背景色可见，新页面在上层
  gsap.set(el, {
    x: xFrom,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    opacity: 1,
    backgroundColor: bgColor,
    zIndex: 2
  })

  // 检查是否有离开元素，如果有则创建timeline同时动画
  if (routeTransition.leaveElement && routeTransition.leaveDone) {
    const timeline = gsap.timeline({
      onComplete: () => {
        // 动画完成后恢复新页面相对定位
        gsap.set(el, { 
          position: 'relative',
          zIndex: 'auto'
        })
        // 调用两个done回调，通知Vue动画完成
        done()
        routeTransition.leaveDone()
        // 清理状态
        routeTransition.leaveElement = null
        routeTransition.leaveDone = null
        routeTransition.enterElement = null
        routeTransition.timeline = null
      }
    })
    
    // 同时动画：新页面滑入，旧页面滑出（使用时间位置0确保完全同步）
    const xTo = isForwardDirection ? '-100%' : '100%'
    timeline
      .to(el, {
        x: '0%',
        duration: 0.5,
        ease: 'power2.inOut',
        force3D: true
      }, 0)
      .to(routeTransition.leaveElement, {
        x: xTo,
        duration: 0.5,
        ease: 'power2.inOut',
        force3D: true
      }, 0)
    
    routeTransition.timeline = timeline
  } else {
    // 如果没有离开元素（首次加载等情况），单独动画
    routeTransition.enterTween = gsap.to(el, {
      x: '0%',
      duration: 0.5,
      ease: 'power2.inOut',
      force3D: true,
      onComplete: () => {
        // 动画完成后恢复相对定位
        gsap.set(el, { 
          position: 'relative',
          zIndex: 'auto'
        })
        done()
      }
    })
  }
  
  // 如果leaveElement存在但leaveDone不存在，说明leave已经完成，单独执行enter
  if (routeTransition.leaveElement && !routeTransition.leaveDone) {
    routeTransition.leaveElement = null
  }
}

// 进入后清理
const onAfterEnter = (el) => {
  // 移除内联背景色，恢复CSS中的背景色
  el.style.backgroundColor = ''
}

// GSAP 离开动画
const onLeave = (el, done) => {
  // 保存离开元素和done回调，不立即执行
  routeTransition.leaveElement = el
  routeTransition.leaveDone = done
  
  // 获取页面的实际背景色
  const computedStyle = window.getComputedStyle(el)
  const bgColor = computedStyle.backgroundColor
  const isTransparent = bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent'
  const isDark = document.documentElement.classList.contains('dark')
  const bgColorValue = isTransparent ? (isDark ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)') : 'transparent'
  
  // 如果是淡入淡出动画，保持opacity不变（由enter动画控制）
  // 如果是滑动动画，设置为绝对定位
  if (routeTransition.useFade) {
    gsap.set(el, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1,
      backgroundColor: bgColorValue,
      opacity: 1
    })
  } else {
    gsap.set(el, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1,
      backgroundColor: bgColorValue
    })
  }

  // 不调用done()，等待onEnter准备好后一起执行同步动画
}

// 离开后清理
const onAfterLeave = (el) => {
  // 清理样式
  el.style.backgroundColor = ''
  el.style.position = ''
  el.style.top = ''
  el.style.left = ''
  el.style.right = ''
  el.style.width = ''
  el.style.zIndex = ''
}

// 取消进入动画
const onEnterCancelled = () => {
  if (routeTransition.enterTween) {
    routeTransition.enterTween.kill()
    routeTransition.enterTween = null
  }
  if (routeTransition.timeline) {
    routeTransition.timeline.kill()
    routeTransition.timeline = null
  }
  routeTransition.enterElement = null
}

// 取消离开动画
const onLeaveCancelled = () => {
  if (routeTransition.leaveTween) {
    routeTransition.leaveTween.kill()
    routeTransition.leaveTween = null
  }
  if (routeTransition.timeline) {
    routeTransition.timeline.kill()
    routeTransition.timeline = null
  }
  routeTransition.leaveElement = null
}

// 判断是否应该使用淡入淡出动画
const shouldUseFade = (from, to) => {
  if (!from || !to) return false
  const fromPath = from.path || ''
  const toPath = to.path || ''
  
  // 从 articles 页面到 articleDetail 使用淡入淡出
  const isFromArticles = fromPath === '/articles' || /^\/articles\/?$/.test(fromPath)
  const isToArticleDetail = /^\/articles\/[^\/]+$/.test(toPath) && toPath !== '/articles'
  
  return isFromArticles && isToArticleDetail
}

onMounted(() => {
  // 开始监听滚动事件
  removeScrollListener = onScroll(handleScroll)
  
  // 监听路由变化，在导航之前设置动画状态
  // 使用 onBeforeRouteUpdate 和 watch 来避免阻塞导航
  router.beforeEach((to, from, next) => {
    // 只在有from路由时设置动画状态（避免首次加载时出错）
    if (from && from.path) {
      routeTransition.useFade = shouldUseFade(from, to)
      if (!routeTransition.useFade) {
        routeTransition.isForward = isForward(from, to, store)
      }
    }
    next() // 确保不阻塞导航
  })
})

onUnmounted(() => {
  // 清理滚动监听
  if (removeScrollListener) {
    removeScrollListener()
  }
  // 清理 GSAP 动画
  if (routeTransition.enterTween) {
    routeTransition.enterTween.kill()
  }
  if (routeTransition.leaveTween) {
    routeTransition.leaveTween.kill()
  }
})
</script>

<style>
@import './assets/styles/index.css';

/* PPT滑动过渡效果 */
.slide-transition-enter-active,
.slide-transition-leave-active {
  transition: none;
}

main {
  position: relative;
  min-height: calc(100vh - 64px);
  overflow: hidden;
  margin-top: 64px;
  background-color: rgb(248, 250, 252);
}

.dark main {
  background-color: rgb(15, 23, 42);
}

main > * {
  position: relative;
  min-height: calc(100vh - 64px);
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>

