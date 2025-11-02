import { createPinia } from 'pinia'

// 创建 Pinia 实例
export const pinia = createPinia()

// 导出所有 stores
export { useUserStore } from './user'
export { useSysInfoStore } from './sysInfo'
export { useContentStore } from './content'
export { useReferenceDataStore } from './referenceData'

