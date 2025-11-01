import { createApp } from 'vue';
import App from './App.vue';
import { pinia } from './stores';
import router, { applyDynamicRoutes } from './router';
import { authApi } from './api';
import { useUserStore, useSysInfoStore } from './stores';

const bootstrap = async () => {
  const app = createApp(App);
  
  // 必须先注册 Pinia 和 Router，然后才能使用 stores
  app.use(pinia);
  app.use(router);
  
  try {
    // 现在可以使用 Pinia stores
    const userStore = useUserStore();
    const sysInfoStore = useSysInfoStore();

    // 自动登录：如果存在token，尝试获取用户信息
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authApi.getCurrentUser();
        if (response && response.data) {
          const userInfo = response.data.user || response.data;
          userStore.login({ userInfo, token });
        }
      } catch (error) {
        // Token无效，清除
        console.warn('Token验证失败，清除登录状态:', error);
        localStorage.removeItem('token');
        userStore.logout();
      }
    }

    await sysInfoStore.fetchSysInfo();
    const menuList = await sysInfoStore.fetchMenuList();
    if (Array.isArray(menuList)) {
      applyDynamicRoutes(menuList);
    }
  } catch (error) {
    console.error('Failed to initialize dynamic routes:', error);
  }

  await router.isReady();
  app.mount('#app');
};

bootstrap();

