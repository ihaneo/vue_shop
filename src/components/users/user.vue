<template>
  <div >
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表区域 -->
    <el-card>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="12">
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" v-model='queryInfo.query' clearable @click="getUserList" @clear='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <!-- 添加索引列 -->
        <el-table-column type='index' label='#'></el-table-column>
        <!-- 表格内容区 -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 这里状态需要渲染该数据展示的效果（开关效果），建一个模板在该模板中使用作用域插槽按需渲染 -->
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 自定义操作 -->
        <el-table-column label="操作" width='180px'>
           <template v-slot="scope">
             <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable='false'><!-- 展示鼠标 hover 时的提示信息 -->
              <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEidtDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable='false'><!-- 展示鼠标 hover 时的提示信息 -->
              <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'><!-- 展示鼠标 hover 时的提示信息 -->
              <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户按钮对话框区域 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close='resetDialog'>
        <!-- 对话框主体内容 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
            <el-form-item label="用户名称" prop="username" @close="editDialogClosed">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        <!-- 底部俩按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editInfo" :rules="editInfoRules" ref="editInfoRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区 -->
      <el-pagination>
        <!-- 每页显示多少条的下拉菜单监听 -->
        @size-change="handleSizeChange"
         <!-- 页码值切换监听-->
        @current-change="handleCurrentChange"
         <!-- 当前显示的第几页的数据 -->
        :current-page="queryInfo.pagenum"
         <!-- 每页下拉项显示的数量 -->
        :page-sizes="[4, 2, 3, 4]"
         <!-- 当前每页显示多少条数据 -->
        :page-size="queryInfo.pagesize"
         <!-- 指定页面显示哪些布局结构 -->
        layout="total, sizes, prev, pager, next, jumper"
         <!-- 共展示多少的数据量 -->
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: '',
  filters: {},
  components: {},
  mixins: [],
  data() {
    // 自定义email正则表达式 验证邮箱
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('邮箱格式不正确！'))
    }
    // 自定义mobile正则表达式 验证手机号
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('手机号格式不正确！'))
    }
    return {

      // 获取用户参数列表 参数键名接口文档一般有提供
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 3
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户表单项数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则数据
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 查询到的用户信息
      editInfo: {},
      // 修改表单的验证规则对象
      editInfoRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.getUserList()
  },
  beforeMount() {},
  mounted() {
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 刷新列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变的事件，下拉分页多少条的菜单项
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async userStateChange(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 操作失败立即将前端页面的状态取反 设置回去
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('状态更新失败！')
      }
      this.$message.success('状态更新成功！')
      // console.log('状态更新成功！')
    },
    // 监听用户对话框关闭事件
    resetDialog () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮 添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加用户网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('用户添加失败')
        }
        this.$message.success('用户添加成功')
        // console.log('用户添加成功')
        // 刷新用户列表 有新增项 重新获取列表
        this.getUserList()
        this.dialogVisible = false
      })
    },
    // 点击用户编辑事件监听
    async showEidtDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        console.log(new Error('查询用户信息失败'))
      }
      this.editInfo = res.data
      this.editDialogVisible = true
      console.log(this.editInfo)
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editInfoRef.resetFields()
    },
    // 监听确定按钮的校验事件 修改用户信息并提交
    editUserInfo () {
      this.$refs.editInfoRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息数据的网络请求
        const { data: res } = await this.$http.put('users/' + this.editInfo.id, {
          email: this.editInfo.email,
          mobile: this.editInfo.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户失败')
          // console.log('更新用户失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户成功')
        // console.log('更新用户成功')
      })
    },
    // 根据id值删除对应的用户信息
    async removeUserById (id) {
      // console.log(id)
      // 弹框询问用户是否确定删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult) // 此时点击确认 打印confirm字符串 点击取消 打印cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '删除失败！'
        })
      }
      this.$message.success('删除成功！')
      this.getUserList()
    }
  }
}
</script>
<style lang='less' scoped>

</style>
