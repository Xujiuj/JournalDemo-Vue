/**
 * 路由顺序工具
 * 基于导航栏menuId判断路由的前进/后退方向，实现左右滑动动画
 */

// 获取路由的menuId（优先级：meta.menuId > 从store获取对应路径的menuId）
function getRouteMenuId(route, store) {
  if (!route) return null;

  // 优先从meta中获取menuId
  if (route.meta && route.meta.menuId) {
    return route.meta.menuId;
  }

  // 如果store可用，尝试从菜单列表中查找对应路径的menuId
  if (store) {
    try {
      // 支持Pinia store (有getMenuList属性) 或 Vuex store (有getters属性)
      let menuList = [];
      if (store.getMenuList) {
        // Pinia store
        menuList = store.getMenuList || [];
      } else if (store.getters && store.getters['sysInfo/getMenuList']) {
        // Vuex store
        menuList = store.getters['sysInfo/getMenuList'] || [];
      }
      const menu = menuList.find((item) => item.menuPath === route.path);
      if (menu && menu.menuId) {
        return menu.menuId;
      }
    } catch (e) {
      // 静默处理错误
    }
  }

  return null;
}

/**
 * 判断路由切换方向
 * @param {Object} from - 源路由
 * @param {Object} to - 目标路由
 * @param {Object} store - Pinia store实例或Vuex store实例（可选）
 * @returns {boolean} true表示前进（目标menuId更大，从左滑入），false表示后退（目标menuId更小，从右滑入）
 */
export function isForward(from, to, store = null) {
  const fromMenuId = getRouteMenuId(from, store)
  const toMenuId = getRouteMenuId(to, store)

  // 如果两个路由都有menuId，直接比较
  if (fromMenuId !== null && toMenuId !== null) {
    // menuId更大表示在导航栏右边，应该左滑（新页面从右滑入）
    // 所以isForward = toMenuId > fromMenuId
    return toMenuId > fromMenuId
  }

  // 如果只有一个有menuId，无法比较，使用路径作为后备
  if (fromMenuId !== null || toMenuId !== null) {
    // 如果有menuId的那个更大，认为是前进
    return (toMenuId ?? 0) > (fromMenuId ?? 0)
  }

  // 都没有menuId，使用路径比较作为后备方案
  const fromPath = from?.path || ''
  const toPath = to?.path || ''

  // 简单的路径比较
  if (fromPath === '/' && toPath !== '/') return true
  if (fromPath !== '/' && toPath === '/') return false

  // 默认返回true（前进）
  return true
}
