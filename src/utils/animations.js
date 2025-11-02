import gsap from 'gsap'

/**
 * 路由转场动画状态
 */
export const routeTransition = {
  useFade: false,
  isForward: true,
  enterTween: null,
  leaveTween: null
}

/**
 * 判断是否应该使用淡入淡出动画
 * @param {Object} from - 源路由
 * @param {Object} to - 目标路由
 * @returns {boolean}
 */
export const shouldUseFade = (from, to) => {
  // 动态路由跳转使用淡入淡出
  if (!from || !to || !from.path || !to.path) {
    return true
  }

  // 从详情页跳转到其他页面使用淡入淡出
  if (from.path.includes('/articles/') && from.path !== '/articles' && to.path !== from.path) {
    return true
  }

  // 从动态路由跳转到其他页面也使用淡入淡出
  if (to.path.includes('/articles/') && to.path !== '/articles') {
    return true
  }

  return false
}

/**
 * 页面进入前
 */
export const onBeforeEnter = (el) => {
  // 确保元素已隐藏
  // PPT式左右滑动：前进时新页面从右滑入(x: 100->0)，后退时新页面从左滑入(x: -100->0)
  gsap.set(el, {
    opacity: 0.01, // 使用0.01而不是0，避免白屏闪烁
    x: routeTransition.useFade ? 0 : (routeTransition.isForward ? 100 : -100),
    willChange: 'transform, opacity' // 优化GPU性能
  })
}

/**
 * 页面进入
 */
export const onEnter = (el, done) => {
  // 取消之前的进入动画
  if (routeTransition.enterTween) {
    routeTransition.enterTween.kill()
  }

  // 创建进入动画 - PPT式滑动效果，GPU加速
  routeTransition.enterTween = gsap.to(el, {
    opacity: 1,
    x: 0,
    duration: routeTransition.useFade ? 0.2 : 0.4,
    ease: 'power2.out',
    force3D: true, // 启用硬件加速
    onComplete: done
  })
}

/**
 * 页面进入后
 */
export const onAfterEnter = (el) => {
  // 清理动画引用
  if (routeTransition.enterTween) {
    routeTransition.enterTween.kill()
    routeTransition.enterTween = null
  }
  
  // 清理will-change优化性能
  if (el) {
    gsap.set(el, { clearProps: 'will-change' })
  }
}

/**
 * 页面离开
 */
export const onLeave = (el, done) => {
  // 取消之前的离开动画
  if (routeTransition.leaveTween) {
    routeTransition.leaveTween.kill()
  }

  // 创建离开动画 - PPT式左右滑动效果
  // 前进时旧页面向左滑出(x: 0->-100)，后退时旧页面向右滑出(x: 0->100)
  routeTransition.leaveTween = gsap.to(el, {
    opacity: 0,
    x: routeTransition.useFade ? 0 : (routeTransition.isForward ? -100 : 100),
    duration: routeTransition.useFade ? 0.15 : 0.35,
    ease: 'power2.in',
    force3D: true, // 启用硬件加速
    onComplete: done
  })
}

/**
 * 页面离开后
 */
export const onAfterLeave = () => {
  // 清理动画引用
  if (routeTransition.leaveTween) {
    routeTransition.leaveTween.kill()
    routeTransition.leaveTween = null
  }
}

/**
 * 进入取消
 */
export const onEnterCancelled = () => {
  if (routeTransition.enterTween) {
    routeTransition.enterTween.kill()
    routeTransition.enterTween = null
  }
}

/**
 * 离开取消
 */
export const onLeaveCancelled = () => {
  if (routeTransition.leaveTween) {
    routeTransition.leaveTween.kill()
    routeTransition.leaveTween = null
  }
}

/**
 * 滚动到指定元素
 * @param {string} selector - CSS选择器
 * @param {number} offset - 偏移量
 * @param {number} duration - 持续时间（秒）
 */
export const scrollToElement = (selector, offset = 0, duration = 0.01) => {
  const element = document.querySelector(selector)
  if (!element) return

  const scrollTop = element.getBoundingClientRect().top + window.scrollY - offset
  
  // 使用 requestAnimationFrame 实现自定义时长的平滑滚动
  const startY = window.scrollY
  const distanceY = scrollTop - startY
  const startTime = performance.now()

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / (duration * 1000), 1)
    
    // 使用 easeOutQuart 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 4)
    
    window.scrollTo(0, startY + distanceY * easeProgress)
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }
  
  requestAnimationFrame(animateScroll)
}

/**
 * 平滑滚动到页面顶部
 * @param {number} duration - 持续时间（秒）
 */
export const scrollToTop = (duration = 0.01) => {
  const startY = window.scrollY
  const startTime = performance.now()

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / (duration * 1000), 1)
    
    // 使用 easeOutQuart 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 4)
    
    window.scrollTo(0, startY * (1 - easeProgress))
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }
  
  requestAnimationFrame(animateScroll)
}

/**
 * 初始化页面动画
 */
export const initPageAnimations = () => {
  // 这里可以添加GSAP ScrollTrigger等动画初始化
  // 例如：序列动画、滚动触发动画等
}

/**
 * 清理ScrollTrigger
 */
export const cleanupScrollTriggers = () => {
  // 清理ScrollTrigger实例
  // 可以在这里添加清理逻辑
}

