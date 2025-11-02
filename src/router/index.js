import { createRouter, createWebHistory } from 'vue-router'
import { buildRoutesFromMenu } from './dynamicRoutes'
import { resolveComponent } from './componentRegistry'

const dynamicRouteNames = new Set()

const baseRoutes = [
  {
    path: '/articles/:manuscriptId',
    name: 'ArticleDetailsDynamic',
    component: resolveComponent('ArticleDetails') || (() => import('@/views/ArticleDetails.vue')),
    props: true
  },
  {
    path: '/submit',
    name: 'Submit',
    component: resolveComponent('Submit') || (() => import('@/views/Submit.vue'))
  },
  {
    path: '/my-submissions',
    name: 'MySubmissions',
    component: resolveComponent('MySubmissions') || (() => import('@/views/MySubmissions.vue'))
  },
  {
    path: '/login',
    name: 'Login',
    component: resolveComponent('Login') || (() => import('@/views/Login.vue'))
  },
  {
    path: '/register',
    name: 'Register',
    component: resolveComponent('Register') || (() => import('@/views/Register.vue'))
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'WildcardFallback',
    component: resolveComponent('Home') || (() => import('@/views/Home.vue'))
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // 使用立即滚动而不是smooth，避免白屏
    return { top: 0, behavior: 'auto' }
  }
})

export const applyDynamicRoutes = (menuList = []) => {
  const routes = buildRoutesFromMenu(menuList)
  routes.forEach((route) => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
      dynamicRouteNames.add(route.name)
    }
  })
}

export const resetDynamicRoutes = () => {
  dynamicRouteNames.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  dynamicRouteNames.clear()
}

export default router

const PROTECTED_ROUTES = ['/submit', '/my-submissions']

// Simple auth guard for submission-related pages
router.beforeEach((to, from, next) => {
  const requiresAuth = PROTECTED_ROUTES.some((path) => to.path === path || to.path.startsWith(`${path}/`))
  if (!requiresAuth) return next()
  const token = localStorage.getItem('token')
  if (token) return next()
  next({ path: '/login', query: { redirect: to.fullPath } })
})
