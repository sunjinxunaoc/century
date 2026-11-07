import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './styles/main.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    // 站内跳转定位优化：普通跳转回到页面顶部；
    // 浏览器前进/后退时恢复该页之前的位置（标准最佳实践）。
    scrollBehavior(_to, _from, savedPosition) {
      return savedPosition || { top: 0 }
    },
  },
)
