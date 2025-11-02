<template>
  <PageScaffold :meteor-count="25" background-type="dark">
    <div class="contact min-h-screen relative overflow-hidden">
      <div class="container relative z-10 mx-auto px-4 py-16">
        <!-- Page Header -->
        <section class="relative z-10 py-8 md:py-12">
          <div class="text-center">
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight font-serif mb-6 animate-fade-in drop-shadow-2xl">
              Contact Us
            </h1>
            <p class="text-lg lg:text-xl text-slate-100 leading-relaxed mb-8 animate-slide-up drop-shadow-lg">
              Get in touch with our editorial team. We're here to help you with your research journey.
            </p>
          </div>
        </section>

        <!-- Contact Content -->
        <section class="relative z-10 py-8 space-y-12">

        <div class="grid gap-8 lg:grid-cols-2">
          <article class="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 md:p-8 shadow-lg space-y-6">
            <h2 class="text-xl font-serif font-semibold text-white leading-tight">Editorial Contacts</h2>
            <ul class="space-y-5">
              <li v-for="item in contactItems" :key="item.id" class="flex items-start gap-4">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-lg">{{ item.icon }}</span>
                  <div>
                  <p class="text-sm uppercase tracking-wide text-slate-400">{{ item.label }}</p>
                  <p class="text-base text-slate-100 whitespace-pre-line">
                    <a v-if="item.href" :href="item.href" class="hover:text-cyan-300 transition-colors">{{ item.value }}</a>
                    <template v-else>{{ item.value }}</template>
                    </p>
                  </div>
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 md:p-8 shadow-lg">
            <h2 class="text-xl font-serif font-semibold mb-4 text-white leading-tight">Send us a Message</h2>
            <form @submit.prevent="submitMessage" class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="form-group">
                  <label class="form-label">Name <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Your full name"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Email <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Phone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Your phone number"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Subject <span class="text-red-400">*</span></label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  placeholder="Message subject"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Message <span class="text-red-400">*</span></label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  maxlength="1000"
                  required
                  placeholder="Your message..."
                  class="form-control resize-none"
                ></textarea>
                <span class="block text-right text-xs text-slate-400">{{ form.message.length }}/1000</span>
              </div>

                  <button
                      type="submit"
                      :disabled="submitting"
                class="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-3 font-semibold text-white transition-all duration-500 hover:scale-[1.02] hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      :class="{ 'animate-pulse': submitting }"
                  >
                <svg v-if="!submitting" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                <svg v-else class="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>{{ submitting ? 'Sending...' : 'Send Message' }}</span>
                  </button>
              </form>
          </article>
        </div>
        </section>

        <section class="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 md:p-8 shadow-lg space-y-6">
          <div class="text-center space-y-2">
            <h2 class="text-2xl font-serif font-semibold text-white">Frequently Asked Questions</h2>
            <p class="text-slate-300">Find answers to common questions about our submission process.</p>
            </div>

          <div class="space-y-4">
            <article
              v-for="faq in faqs"
              :key="faq.faqId"
              class="rounded-lg border border-slate-700/60 bg-slate-800/60 p-4 transition-colors hover:border-cyan-500/40"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between text-left text-lg font-medium text-slate-100"
                @click="toggleFaq(faq.faqId)"
              >
                <span>{{ faq.faqQuestion || 'Frequently Asked Question' }}</span>
                <span class="text-cyan-300 transition-transform duration-200" :class="{ 'rotate-180': faq.isOpen }">⌄</span>
              </button>
              <p v-if="faq.isOpen" class="mt-3 text-slate-300 leading-relaxed">
                      {{ faq.faqAnswer || 'This is a sample answer to the frequently asked question. Please check back later for more detailed information.' }}
                    </p>
            </article>

            <article v-if="faqs.length === 0" class="rounded-lg border border-dashed border-slate-700/60 bg-slate-800/40 p-6 text-center text-slate-300">
              No FAQs yet. Check back later for updates.
            </article>
                  </div>
        </section>
      </div>
    </div>
  </PageScaffold>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { contactFaqApi } from '@/api';
import { useSysInfoStore } from '@/stores';
import PageScaffold from '@/components/layout/PageScaffold.vue';

const sysInfoStore = useSysInfoStore();
const branding = computed(() => sysInfoStore.brandingInfo);

// 从 Pinia store 获取系统信息
const displayAddress = computed(() => branding.value.address)
const displayEmail = computed(() => branding.value.email)
const displayPhone = computed(() => branding.value.phone)

const contactItems = computed(() => [
  {
    id: 'address',
    label: 'Editorial Office',
    value: displayAddress.value,
    icon: '🏢'
  },
  {
    id: 'email',
    label: 'Email',
    value: displayEmail.value,
    icon: '✉️',
    href: `mailto:${displayEmail.value}`
  },
  {
    id: 'phone',
    label: 'Phone',
    value: displayPhone.value,
    icon: '☎️',
    href: `tel:${displayPhone.value}`
  }
])

const faqs = ref([])
const submitting = ref(false)

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

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const loadData = async () => {
  try {
    const faqResponse = await contactFaqApi.getFaqList({
      pageNum: 1,
      pageSize: 100,
      faqStatus: 1
    })
    faqs.value = extractList(faqResponse).map(item => ({
      ...item,
      isOpen: false
    }))
  } catch (error) {
    console.error('Failed to load data:', error)
    faqs.value = []
  }
}

const toggleFaq = (faqId) => {
  const faq = faqs.value.find(f => f.faqId === faqId)
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}

const submitMessage = async () => {
  if (!form.name || !form.email || !form.subject || !form.message) {
    return
  }

  submitting.value = true
  try {
    console.log('Submitting message:', form)
    await new Promise(resolve => setTimeout(resolve, 2000))
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
    console.log('Message sent successfully')
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Contact页面专用样式 */
@import '@/assets/styles/pages/contact.css';
</style>
