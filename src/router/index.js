import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
//  导出前先挂载一个路由导航守卫，为路由添加对象
router.beforeEach((to, from, next) => {
  // to要去哪个路径
  // from来自哪个路径
  /* next是一个函数 表示放行
         next（）放行
         next（'/###'）强制放行到###   */
  // 如果要去登录页 直接正常放行
  if (to.path === '/login') return next()
  // 获取token    前面login.vue中登录按钮已经触发goForm登录请求 且同时保存了token在客户端
  const tokenStr = window.sessionStorage.getItem('token')
  // 接下来判断token是否正常获取到 如未获取到,则为空字符串，判断为false，if走！false强制放行止登录页面;如正常获取，直接放行
  if (!tokenStr) return next('/login')
  else next()
})
export default router
