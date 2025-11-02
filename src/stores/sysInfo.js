import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {sysInfoApi, menuApi} from '@/api'
import {withFallback} from '@/config/branding'

/**
 * 系统信息状态管理
 */
export const useSysInfoStore = defineStore('sysInfo', () => {
    // 状态
    const sysInfoList = ref([])
    const menuList = ref([])
    const isLoading = ref(false)

    // Getters
    const currentSysInfo = computed(() => {
        if (!sysInfoList.value || sysInfoList.value.length === 0) return {}
        return sysInfoList.value[0] || {}
    })

    /**
     * 品牌信息，用于页面展示
     */
    const brandingInfo = computed(() => {
        const info = currentSysInfo.value
        return {
            name: withFallback(info?.infoName, 'Academic Journal'),
            shortName: withFallback(info?.infoShortName, 'Journal'),
            mission: withFallback(info?.infoMission, 'Promoting academic excellence and knowledge exchange'),
            tagline: withFallback(info?.infoTagline, 'Your source for cutting-edge research'),
            publisher: withFallback(info?.infoPublisher, 'Academic Press'),
            issn: withFallback(info?.infoIssn, '0000-0000'),
            logo: info?.infoLogo || '/journal-logo.png',
            email: withFallback(info?.infoEmail, 'contact@journal.com'),
            phone: withFallback(info?.infoPhone, '+1 234 567 8900'),
            address: withFallback(info?.infoAddress, '123 Academic Street'),
            citationName: withFallback(info?.infoCitationName, 'Academic Journal'),
            impactFactor: withFallback(info?.infoImpactFactor, '5.0'),
            foundedYear: withFallback(info?.infoFoundedYear, '2000'),
            website: withFallback(info?.infoWebsite, 'https://www.journal.com'),
            // 路由配置
            homeRoute: '/',
            articlesRoute: '/articles',
            aboutRoute: '/about',
            contactRoute: '/contact',
            submitRoute: '/submit',
            loginRoute: '/login',
            registerRoute: '/register'
        }
    })

    const getMenuList = computed(() => menuList.value || [])

    /**
     * 获取系统信息列表
     */
    const fetchSysInfo = async () => {
        isLoading.value = true
        try {
            const response = await sysInfoApi.getSysInfoList({pageNum: 1, pageSize: 1})
            const list = Array.isArray(response) ? response : (response?.data || response?.rows || [])
            sysInfoList.value = list
            return list
        } catch (error) {
            console.error('Failed to fetch system info:', error)
            sysInfoList.value = []
            return []
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 获取菜单列表
     */
    const fetchMenuList = async () => {
        try {
            const response = await menuApi.getMenuList({pageNum: 1, pageSize: 100})
            const list = Array.isArray(response) ? response : (response?.data || response?.rows || [])
            menuList.value = list
            return list
        } catch (error) {
            console.error('Failed to fetch menu list:', error)
            menuList.value = []
            return []
        }
    }

    return {
        // State
        sysInfoList,
        menuList,
        isLoading,
        // Getters
        currentSysInfo,
        brandingInfo,
        getMenuList,
        // Actions
        fetchSysInfo,
        fetchMenuList
    }
})

