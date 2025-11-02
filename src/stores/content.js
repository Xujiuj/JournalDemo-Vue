import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articleApi, noticeApi } from '@/api'
import { HOME_FEATURED_ARTICLE_LIMIT, HOME_NOTICE_LIMIT } from '@/config/app'

/**
 * 内容状态管理
 */
export const useContentStore = defineStore('content', () => {
  // 状态
  const featuredArticles = ref([])
  const latestNotices = ref([])
  const isLoadingFeatured = ref(false)
  const isLoadingNotices = ref(false)

  /**
   * 获取精选文章
   */
  const fetchFeaturedArticles = async () => {
    isLoadingFeatured.value = true
    try {
      const response = await articleApi.getLatestArticles(HOME_FEATURED_ARTICLE_LIMIT)
      const list = Array.isArray(response) ? response : (response?.data || response?.rows || [])
      featuredArticles.value = list
      return list
    } catch (error) {
      console.error('Failed to fetch featured articles:', error)
      featuredArticles.value = []
      return []
    } finally {
      isLoadingFeatured.value = false
    }
  }

  /**
   * 获取最新公告
   */
  const fetchLatestNotices = async () => {
    isLoadingNotices.value = true
    try {
      const response = await noticeApi.getTopNotices(HOME_NOTICE_LIMIT)
      const list = Array.isArray(response) ? response : (response?.data || response?.rows || [])
      latestNotices.value = list
      return list
    } catch (error) {
      console.error('Failed to fetch latest notices:', error)
      latestNotices.value = []
      return []
    } finally {
      isLoadingNotices.value = false
    }
  }

  /**
   * 清空文章缓存
   */
  const clearFeaturedArticles = () => {
    featuredArticles.value = []
  }

  /**
   * 清空公告缓存
   */
  const clearLatestNotices = () => {
    latestNotices.value = []
  }

  return {
    // State
    featuredArticles,
    latestNotices,
    isLoadingFeatured,
    isLoadingNotices,
    // Actions
    fetchFeaturedArticles,
    fetchLatestNotices,
    clearFeaturedArticles,
    clearLatestNotices
  }
})

