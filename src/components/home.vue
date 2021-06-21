<template>
<el-container>
  <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="@/assets/img/mtest1.jpg" alt="">
      <span>shop后台管理系统</span>
    </div>
    <el-button type='info' @click="backForm">退出</el-button>
  </el-header>
  <!-- 主体内容区域 -->
  <el-container>
    <!-- 左侧边栏 -->
    <el-aside :width="toggleBtn? '64px' : '200px'">
      <div class="toggle-btn" @click="toggleCollapse">|||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened='true'
      :collapse='toggleBtn'
      :collapse-transition='false'
      :router='true'
      :default-active='activePath'>
      <!-- 一级菜单 -->
      <el-submenu :index="item.id +''" v-for="item in menusList" :key='item.id'>
        <!-- 一级菜单的模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单（被包裹在一级之中） -->
        <el-menu-item :index="'/'+menusItem.path" v-for="menusItem in item.children" :key='menusItem.id' @click="saveNavStatus('/'+menusItem.path)">
           <!-- 二级菜单的模板 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{menusItem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 内容区 -->
    <el-main>
      <!-- 子路由占位 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: '',
  filters: {},
  components: {},
  mixins: [],
  data() {
    return {
      menusList: [],
      toggleBtn: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    // 生命周期 页面创建时获取菜单数据
    this.getList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  beforeMount() {},
  mounted() {
  },
  beforeUpdate() {},
  updated () {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    backForm() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else this.menusList = res.data
      console.log(res)
    },
    // 点击折叠按钮事件，折叠侧边栏
    toggleCollapse() {
      this.toggleBtn = !this.toggleBtn
    },
    // 点击二级菜单项时，保存该项的路径（链接激活的状态）到sessionStroage中且自定义键为activePath
    saveNavStatus(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.el-container{
  height: 100%;;
}
.el-header{
  background-color:#373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-style: 30px;
  >div{
    display:flex;
    align-items: center;
    >span{
      padding-left: 10px;
    }
  }
}
.el-aside{
  background-color:#373744;
  .toggle-btn{
    background-color: #4A5064;
    color: #fff;
    font-size: 14px;
    text-align: center;
    letter-spacing: 0.1em;
    line-height: 24px;
    cursor: pointer;
  }
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color:#eaedf1;
}

</style>
