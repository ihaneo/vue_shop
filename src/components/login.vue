<template>
  <div class='login_container'>
  <div class="login_box">
    <!-- 头像区 -->
    <div class="avatar_box">
      <img src="@/assets/img/test.jpg" alt="">
    </div>
    <!-- 表单区 -->
    <el-form :model="loginForm" :rules="loginFormRules" ref='loginFormRef' label-width="0px" class='login_form'>
      <!-- 登录名 -->
      <el-form-item prop='username' >
        <el-input
        v-model="loginForm.username"
        placeholder="请输入用户名"
        prefix-icon="el-icon-search">
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item  prop='password'>
        <el-input
        v-model="loginForm.password"
        placeholder="请输入登录密码"
        prefix-icon="el-icon-search"
        type='password'>
        </el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item class='login_btns'>
        <el-button type="primary" @click="goForm">
        登录
        </el-button>
        <el-button type="info" @click="resetForm">
        重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      // 登录表单数据绑定的对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单登录验证规则对象
      loginFormRules: {
        // 验证用户名合法性
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在3到8个字符', trigger: 'blur' }
        ],
        // 验证密码合法性
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 监听到重置按钮被点击后，触发该函数，重置登录表单，规则在element-ui
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    goForm() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status !== 200) return console.log('登陆失败')
        else console.log('登陆成功')
        console.log(result)
        // 登录成功后的token保存到客户端sessionStorage中
        window.sessionStorage.setItem('token', result.data.token)
        // 此处编程式导航跳转到后台页面，路由地址/home
        this.$router.push('/home')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #aaa;
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form{
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
  .login_btns{
    display: flex;
    justify-content: center;
  }
}
</style>
