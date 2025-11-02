import { defineStore } from 'pinia'
import { ref } from 'vue'
import { enumApi } from '@/api'

/**
 * 参考数据状态管理
 */
export const useReferenceDataStore = defineStore('referenceData', () => {
  // 状态
  const articleStatusMap = ref({})
  const manuscriptTypeMap = ref({})
  const articleTypeMap = ref({})
  const submissionTypeMap = ref({})
  const fileTypeMap = ref({})
  const degreeMap = ref({})

  /**
   * 确保文章状态数据已加载
   */
  const ensureArticleStatus = async () => {
    if (Object.keys(articleStatusMap.value).length > 0) {
      return articleStatusMap.value
    }

    try {
      const response = await enumApi.getArticleStatusOptions()
      const options = Array.isArray(response) ? response : (response?.data || [])
      const map = {}
      
      options.forEach(option => {
        if (option.value !== undefined && option.label !== undefined) {
          map[option.value] = option.label
        }
      })

      articleStatusMap.value = map
      return map
    } catch (error) {
      console.error('Failed to fetch article status options:', error)
      return articleStatusMap.value
    }
  }

  /**
   * 获取稿件类型
   */
  const fetchManuscriptTypes = async () => {
    try {
      const response = await enumApi.getManuscriptTypeOptions()
      const options = Array.isArray(response) ? response : (response?.data || [])
      const map = {}
      
      options.forEach(option => {
        if (option.value !== undefined && option.label !== undefined) {
          map[option.value] = option.label
        }
      })

      manuscriptTypeMap.value = map
      return map
    } catch (error) {
      console.error('Failed to fetch manuscript type options:', error)
      return manuscriptTypeMap.value
    }
  }

  /**
   * 获取文章类型
   */
  const fetchArticleTypes = async () => {
    try {
      const response = await enumApi.getArticleTypeOptions()
      const options = Array.isArray(response) ? response : (response?.data || [])
      const map = {}
      
      options.forEach(option => {
        if (option.value !== undefined && option.label !== undefined) {
          map[option.value] = option.label
        }
      })

      articleTypeMap.value = map
      return map
    } catch (error) {
      console.error('Failed to fetch article type options:', error)
      return articleTypeMap.value
    }
  }

  /**
   * 获取提交类型
   */
  const fetchSubmissionTypes = async () => {
    try {
      const response = await enumApi.getSubmissionTypeOptions()
      const options = Array.isArray(response) ? response : (response?.data || [])
      const map = {}
      
      options.forEach(option => {
        if (option.value !== undefined && option.label !== undefined) {
          map[option.value] = option.label
        }
      })

      submissionTypeMap.value = map
      return map
    } catch (error) {
      console.error('Failed to fetch submission type options:', error)
      return submissionTypeMap.value
    }
  }

  /**
   * 获取文件类型
   */
  const fetchFileTypes = async () => {
    try {
      const response = await enumApi.getFileTypeOptions()
      const options = Array.isArray(response) ? response : (response?.data || [])
      const map = {}
      
      options.forEach(option => {
        if (option.value !== undefined && option.label !== undefined) {
          map[option.value] = option.label
        }
      })

      fileTypeMap.value = map
      return map
    } catch (error) {
      console.error('Failed to fetch file type options:', error)
      return fileTypeMap.value
    }
  }

  /**
   * 获取学位类型
   */
  const fetchDegreeTypes = async () => {
    try {
      const response = await enumApi.getDegreeOptions()
      const options = Array.isArray(response) ? response : (response?.data || [])
      const map = {}
      
      options.forEach(option => {
        if (option.value !== undefined && option.label !== undefined) {
          map[option.value] = option.label
        }
      })

      degreeMap.value = map
      return map
    } catch (error) {
      console.error('Failed to fetch degree options:', error)
      return degreeMap.value
    }
  }

  return {
    // State
    articleStatusMap,
    manuscriptTypeMap,
    articleTypeMap,
    submissionTypeMap,
    fileTypeMap,
    degreeMap,
    // Actions
    ensureArticleStatus,
    fetchManuscriptTypes,
    fetchArticleTypes,
    fetchSubmissionTypes,
    fetchFileTypes,
    fetchDegreeTypes
  }
})

