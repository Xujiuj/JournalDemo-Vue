<template>
  <PageScaffold :meteor-count="25" :show-progress="true" background-type="dark">
    <div class="notices min-h-screen relative overflow-hidden">
      <div class="container relative z-10 mx-auto px-4 py-16">
      <!-- Page Header -->
        <section class="relative z-10 py-8 md:py-12">
          <div class="text-center">
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight font-serif mb-6 animate-fade-in drop-shadow-2xl">
              Notices
            </h1>
            <p class="text-lg lg:text-xl text-slate-100 leading-relaxed mb-8 animate-slide-up drop-shadow-lg">
              Stay updated with the latest announcements and news
            </p>
          </div>
        </section>

      <!-- Notices List -->
        <section class="relative z-10 py-8">
          <div class="grid gap-8">
            <article v-for="(notice, index) in notices" :key="notice.noticeId" class="group article-card animate-slide-up" :style="{ animationDelay: (index * 0.1) + 's' }">
              <!-- 流光效果层 -->
              <div class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150 pointer-events-none overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent dark:via-amber-200/5 transform -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/5 to-transparent dark:via-amber-100/3 transform -translate-x-full hover:translate-x-full transition-transform duration-450 ease-in-out" style="animation-delay: 0.06s;"></div>
              </div>
              
              <div class="relative z-10">
                <!-- 第一行：通知类型 -->
                <div class="mb-3">
                  <span :class="getTypeBadgeClasses(notice.noticeType)">
                    {{ getNoticeTypeText(notice.noticeType) }}
                  </span>
                </div>

                <!-- 第二行：标题 -->
                <div class="mb-2">
                  <h3 class="text-xl font-bold text-white dark:text-white font-serif leading-tight group-hover:text-amber-300 dark:group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
                    <router-link 
                      :to="`/notices/${notice.noticeId}`" 
                      class="hover:underline block"
                    >
                      {{ notice.noticeTitle }}
                    </router-link>
                  </h3>
                </div>

                <!-- 第二行：内容 -->
                <div class="flex items-center text-slate-300 dark:text-slate-300 text-sm mb-2">
                  <p class="line-clamp-2">{{ notice.noticeContent }}</p>
                </div>

                <!-- 第三行：左侧Read More，右侧观看量 -->
                <div class="flex justify-between items-center mt-3">
                  <!-- 左边：Read More -->
                  <router-link 
                    :to="`/notices/${notice.noticeId}`"
                    class="group/link inline-flex items-center text-white dark:text-white font-semibold hover:text-amber-300 dark:hover:text-amber-300 transition-all duration-300 hover:translate-x-1 text-sm"
                  >
                    Read More
                    <svg class="w-5 h-5 ml-2 transition-transform duration-300 group-hover/link:translate-x-1"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </router-link>

                  <!-- 右边：观看量 -->
                  <div class="flex items-center text-slate-400 dark:text-slate-400 text-sm">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ notice.noticeViews || 0 }} views
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

      <!-- No Notices -->
      <div v-if="notices.length === 0" class="no-notices">
        <h3>No notices available</h3>
        <p>Check back later for updates.</p>
      </div>
    </div>
  </div>
  </PageScaffold>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { noticeApi } from '@/api'
import PageScaffold from '@/components/layout/PageScaffold.vue'

const notices = ref([])
const loading = ref(false)

const extractList = (payload) => {
  if (!payload) {
    return []
  }

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (Array.isArray(payload.rows)) {
    return payload.rows
  }

  if (payload.data && Array.isArray(payload.data.data)) {
    return payload.data.data
  }

  return []
}

const loadNotices = async () => {
  loading.value = true
  try {
    const response = await noticeApi.getNotices({
      pageNum: 1,
      pageSize: 50,
      noticeStatus: 1
    })
    notices.value = extractList(response)
  } catch (error) {
    console.error('Failed to load notices:', error)
    // 设置默认数据，确保页面正常显示
    notices.value = [
      {
        noticeId: 1,
        noticeTitle: '欢迎访问期刊门户网站',
        noticeContent: '感谢您访问我们的期刊门户网站。我们致力于为科研工作者提供高质量的学术交流平台。',
        noticeType: 'ANNOUNCEMENT',
        noticePriority: 'NORMAL',
        noticePublishDate: new Date().toISOString(),
        noticeViews: 50
      }
    ]
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getNoticeTypeText = (type) => {
  const typeMap = {
    'ANNOUNCEMENT': 'Announcement',
    'CALL_FOR_PAPERS': 'Call for Papers',
    'CONFERENCE': 'Conference',
    'DEADLINE': 'Deadline',
    'UPDATE': 'Update'
  }
  return typeMap[type] || type
}

// Gradient palette by type
const TYPE_STYLES = Object.freeze({
  ANNOUNCEMENT: {
    badge: 'from-cyan-500 to-blue-600',
    top: 'from-cyan-400 to-blue-500'
  },
  CALL_FOR_PAPERS: {
    badge: 'from-amber-500 to-yellow-600',
    top: 'from-amber-400 to-yellow-500'
  },
  CONFERENCE: {
    badge: 'from-violet-500 to-fuchsia-600',
    top: 'from-violet-400 to-fuchsia-500'
  },
  DEADLINE: {
    badge: 'from-rose-500 to-red-600',
    top: 'from-rose-400 to-red-500'
  },
  UPDATE: {
    badge: 'from-emerald-500 to-teal-600',
    top: 'from-emerald-400 to-teal-500'
  },
  DEFAULT: {
    badge: 'from-slate-500 to-slate-600',
    top: 'from-slate-400 to-slate-500'
  }
})

const getTypeBadgeClasses = (type) => {
  const sty = TYPE_STYLES[type] || TYPE_STYLES.DEFAULT
  return `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${sty.badge} shadow`
}

const getTopBarGradient = (type) => {
  const sty = TYPE_STYLES[type] || TYPE_STYLES.DEFAULT
  return `bg-gradient-to-r ${sty.top}`
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
/* 组件样式导入 */
@import '@/assets/styles/components/article-cards.css';
@import '@/assets/styles/components/feedback.css';
</style>