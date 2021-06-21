import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
// 导入全局样式表
import '@/assets/styles/global.css'
// 配置axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios请求拦截器添加token 从而保证能够获取相应数据的权限 request就是请求拦截器，是属性interceptor的一个成员，
// 利用use（）为request挂载回调函数，使用axios向服务端发送数据请求之前必然会调用use函数，也就是会对请求做一次预处理
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  /*  最后必须返回这个 */
  return config
})
// 将引入的第三方库axios挂载到vue实例原型的$http属性上
Vue.prototype.$http = axios
// Vue.use(ElementUI)这是想直接使用全局引入element-ui
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
