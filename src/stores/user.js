import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  
  /**
   * 登录
   * @param {Object} data - 登录数据
   * @param {Object} data.userInfo - 用户信息
   * @param {string} data.token - 访问令牌
   */
  const login = async (data) => {
    const { userInfo, token: newToken } = data
    token.value = newToken
    currentUser.value = userInfo
    localStorage.setItem('token', newToken)
  }

  /**
   * 登出
   */
  const logout = () => {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  /**
   * 更新用户信息
   * @param {Object} userInfo - 新的用户信息
   */
  const updateUserInfo = (userInfo) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...userInfo }
    }
  }

  /**
   * 获取当前用户信息
   */
  const fetchCurrentUser = async () => {
    if (!token.value) return null

    isLoading.value = true
    try {
      const response = await authApi.getCurrentUser()
      const userInfo = response.data.user || response.data
      currentUser.value = userInfo
      return userInfo
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      logout()
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    currentUser,
    token,
    isLoading,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    updateUserInfo,
    fetchCurrentUser
  }
})

